import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { getMonthsUpToIndex, getTotalDaysInMonth } from 'src/utils/getDays';

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
      throw new NotFoundException(
        `leaderboard not available for ${queryOptions.month} month`,
      );
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
    leaderboardResponseData.forEach((student) => {
      if (student.performance < prevPerformance) {
        rank = rank + 1;
        prevPerformance = student.performance;
      }
      student.rank = rank;
    });

    return leaderboardResponseData;
  }

  async getYearlyLeaderboard(
    year: number,
    classId: string,
    monthLength: number = 11,
  ) {
    // get all leaderboard data to making the average performance for the year;
    const allMonthsLeaderboardData = await Promise.all(
      getMonthsUpToIndex(monthLength).map(async (month) => {
        const monthlyLeaderboard = await this.getMonthlyLeaderboard({
          year,
          classId,
          month,
        });

        return {
          classId,
          month,
          monthlyLeaderboard,
        };
      }),
    );

    const studentWiseTotalPerformance: {
      [key: string]: {
        totalPerformance: number;
        finalExamGpa: number;
        rank: number;
      };
    } = {};

    allMonthsLeaderboardData.forEach((singleMonthLeaderboard) => {
      singleMonthLeaderboard.monthlyLeaderboard.forEach((student) => {
        if (studentWiseTotalPerformance[student.studentId]) {
          studentWiseTotalPerformance[student.studentId] = {
            ...studentWiseTotalPerformance[student.studentId],
            totalPerformance:
              studentWiseTotalPerformance[student.studentId].totalPerformance +
              student.performance,
          };
        } else {
          studentWiseTotalPerformance[student.studentId] = {
            ...studentWiseTotalPerformance[student.studentId],
            totalPerformance: student.performance,
          };
        }
      });
    });

    // final exam find with classId and December month. Final exam title must be include "final" word when the exam is created.
    const finalExam = await this.prisma.exam.findFirst({
      where: {
        classId,
        month: 'December',
        year,
        title: {
          contains: 'Final',
          mode: 'insensitive',
        },
      },
    });

    const finalExamResult = await this.prisma.examResult.findMany({
      where: {
        examId: finalExam.id,
      },
    });

    finalExamResult.forEach((result) => {
      studentWiseTotalPerformance[result.studentId] = {
        ...studentWiseTotalPerformance[result.studentId],
        finalExamGpa: result.gpa,
      };
    });

    const leaderboardResponseData = Object.entries(
      studentWiseTotalPerformance,
    ).map(([key, value]) => {
      const avgPerformance = Math.round(
        value.totalPerformance / (monthLength + 1),
      );
      const finalExamGpaInPercentage = Math.round(
        (100 * value.finalExamGpa) / 5,
      );
      const overAllPerformance = Math.round(
        0.3 * avgPerformance + 0.7 * finalExamGpaInPercentage,
      );
      return {
        studentId: key,
        avgPerformance: avgPerformance || 0,
        finalExamGpa: value.finalExamGpa,
        finalExamGpaInPercentage,
        overAllPerformance: overAllPerformance || 0,
        rank: null,
      };
    });

    // Sorting the leaderboardResponseData array based on performance in descending order
    leaderboardResponseData.sort(
      (a, b) => b.overAllPerformance - a.overAllPerformance,
    );

    // Adding rank field based on the sorted array
    let rank = 1;
    let prevPerformance = leaderboardResponseData[0].overAllPerformance;
    leaderboardResponseData.forEach((student) => {
      if (student.overAllPerformance < prevPerformance) {
        rank = rank + 1;
        prevPerformance = student.overAllPerformance;
      }
      student.rank = rank;
    });

    return leaderboardResponseData;
  }
}
