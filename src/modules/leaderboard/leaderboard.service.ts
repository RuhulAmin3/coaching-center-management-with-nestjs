import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { getTotalDaysInMonth } from 'src/utils/getDays';

@Injectable()
export class LeaderboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getMonthlyLeaderboard(queryOptions) {
    const monthlyAttendence = await this.prisma.attendance.findMany({
      where: {
        classId: queryOptions.classId,
        month: queryOptions.month,
        year: +queryOptions.year,
      },
      select: {
        students: true,
      },
    });

    if (!monthlyAttendence.length) {
      throw new NotFoundException('leaderboard not available for the month');
    }

    const leaderboardData: {
      [key: string]: {
        totalAttendence: number;
        totalExam: number;
        totalGpa: number;
      };
    } = {};

    // student attendence calculation for a single month
    monthlyAttendence.forEach((attendence) => {
      attendence.students.forEach((present) => {
        if (present.isPresent) {
          leaderboardData[present.studentId]
            ? (leaderboardData[present.studentId] = {
                ...leaderboardData[present.studentId],
                totalAttendence:
                  leaderboardData[present.studentId].totalAttendence + 1,
              })
            : (leaderboardData[present.studentId] = {
                ...leaderboardData[present.studentId],
                totalAttendence: 1,
              });
        }
      });
    });

    // student exam result calculation for a single month
    const monthlyExamResult = await this.prisma.examResult.findMany({
      where: {
        classId: queryOptions.classId,
        exam: {
          month: queryOptions.month,
          year: +queryOptions.year,
        },
      },
    });

    monthlyExamResult.forEach((examResult) => {
      if (leaderboardData[examResult.studentId].totalGpa) {
        leaderboardData[examResult.studentId] = {
          ...leaderboardData[examResult.studentId],
          totalExam: leaderboardData[examResult.studentId].totalExam + 1,
          totalGpa: +(
            leaderboardData[examResult.studentId].totalGpa + examResult.gpa
          ).toFixed(2),
        };
      } else {
        leaderboardData[examResult.studentId] = {
          ...leaderboardData[examResult.studentId],
          totalGpa: examResult.gpa,
          totalExam: 1,
        };
      }
    });

    // converted into an array with added all response data
    const leaderboardResponseData = Object.entries(leaderboardData).map(
      ([key, value]) => {
        const avgGpa = +(value.totalGpa / value.totalExam).toFixed(2); // avgGpa should not be round
        const totalAttendenceInPercentage = Math.round(
          (value.totalAttendence * 100) /
            getTotalDaysInMonth(queryOptions.month),
        );
        const avgGpaInPercentage = Math.round((avgGpa * 100) / 5);
        const performance = Math.round(
          0.3 * totalAttendenceInPercentage + 0.7 * avgGpaInPercentage,
        );
        return {
          studentId: key,
          totalAttendence: value.totalAttendence,
          totalAttendenceInPercentage: totalAttendenceInPercentage,
          avgGpa: avgGpa,
          avgGpaInPercentage: avgGpaInPercentage,
          performance: performance,
        };
      },
    );

    return leaderboardResponseData;
  }
}
