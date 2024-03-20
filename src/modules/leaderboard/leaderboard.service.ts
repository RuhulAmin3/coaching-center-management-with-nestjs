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
        totalAttendExam: number;
        totalGpa: number;
        rank: number;
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
          totalAttendExam:
            leaderboardData[examResult.studentId].totalAttendExam + 1,
          totalGpa: +(
            leaderboardData[examResult.studentId].totalGpa + examResult.gpa
          ).toFixed(2),
        };
      } else {
        leaderboardData[examResult.studentId] = {
          ...leaderboardData[examResult.studentId],
          totalGpa: examResult.gpa,
          totalAttendExam: 1,
        };
      }
    });

    const totalExam = await this.prisma.exam.count({
      where: {
        classId: queryOptions.classId,
        month: queryOptions.month,
        year: +queryOptions.year,
      },
    });

    // converted into an array with added all response data
    const leaderboardResponseData = Object.entries(leaderboardData).map(
      ([key, value]) => {
        const avgGpa = +(value.totalGpa / totalExam).toFixed(2); // avgGpa should not be round
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
          totalAttendExam: value.totalAttendExam,
          totalAttendenceInPercentage: totalAttendenceInPercentage,
          avgGpa: avgGpa,
          avgGpaInPercentage: avgGpaInPercentage,
          performance: performance,
          rank: null,
        };
      },
    );

    // Sorting the leaderboardResponseData array based on performance in descending order
    leaderboardResponseData.sort((a, b) => b.performance - a.performance);

    // Adding rank field based on the sorted array
    let rank = 1;
    let prevPerformance = leaderboardResponseData[0].performance;
    leaderboardResponseData.forEach((student, index) => {
      if (student.performance < prevPerformance) {
        rank = index + 1;
        prevPerformance = student.performance;
      }
      student.rank = rank;
    });

    return leaderboardResponseData;
  }

  // async getYearlyLeaderboard(queryOptions) {}
}
