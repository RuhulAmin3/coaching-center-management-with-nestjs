import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  PaginationMetaData,
  calculatePagination,
} from 'src/utils/calculatePagination';

@Injectable()
export class AttendenceService {
  constructor(private readonly prisma: PrismaService) {}

  async addAttendence(data) {
    const isExist = await this.prisma.attendance.findUnique({
      where: {
        classId: data.classId,
        date: data.date,
        month: data.month,
        year: data.year,
      },
    });
    if (isExist) {
      const date = new Date(data.date);
      throw new ConflictException(
        `${date.toLocaleDateString('en-US')} attendance already exist for ${
          data.month
        } month`,
      );
    }
    const result = await this.prisma.attendance.create({
      data,
    });
    if (!result) {
      throw new BadRequestException('failed to create attendance');
    }
    return result;
  }

  async getAttendence(id: string) {
    const result = await this.prisma.attendance.findUnique({
      where: {
        id,
      },
    });

    if (!result) {
      throw new NotFoundException('attendance not found');
    }

    return result;
  }

  async getStudentAttendence(studentId: string, filters, paginationOptions) {
    const { page, limit, sortBy, sortOrder, skip } =
      calculatePagination(paginationOptions);
    const result = await this.prisma.attendance.findMany({
      where: {
        month: filters.month,
        year: +filters.year,
        students: {
          some: {
            studentId: studentId,
          },
        },
      },
      take: limit,
      skip,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    if (!result) {
      throw new NotFoundException('single student attendance not found');
    }

    const updatedResult = result.map((atndnce) => {
      const student = atndnce.students.filter(
        (studs) => studs.studentId === studentId,
      );
      atndnce['students'] = student;

      return atndnce;
    });

    if (result.length === 0) {
      throw new NotFoundException(`${filters.month} attendence not available.`);
    }

    const totalDoc = await this.prisma.attendance.count({
      where: {
        month: filters.month,
        year: +filters.year,
        students: {
          some: {
            studentId: studentId,
          },
        },
      },
    });

    const { totalPages, nextPage, prevPage } = PaginationMetaData(
      page,
      totalDoc,
      limit,
    );
    const meta = {
      limit: limit,
      totalDoc,
      page: page,
      totalPages,
      prevPage,
      nextPage,
    };
    return { data: updatedResult, meta };
  }

  async getAttendenceForAdmin(query, paginationOptions) {
    const { page, limit, sortBy, sortOrder, skip } =
      calculatePagination(paginationOptions);

    const result = await this.prisma.attendance.findMany({
      where: {
        classId: query.classId,
        month: query.month,
        year: query.year,
      },
      take: limit,
      skip,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    if (result.length === 0) {
      throw new NotFoundException(
        `${query.month} attendence not available for the class`,
      );
    }

    const totalDoc = await this.prisma.attendance.count({
      where: {
        classId: query.classId,
        month: query.month,
        year: query.year,
      },
    });

    const { totalPages, nextPage, prevPage } = PaginationMetaData(
      page,
      totalDoc,
      limit,
    );
    const meta = {
      limit: limit,
      totalDoc,
      page: page,
      totalPages,
      prevPage,
      nextPage,
    };
    return { data: result, meta };
  }

  async updateAttendence(id: string, data) {
    const result = await this.prisma.attendance.findUnique({
      where: {
        id,
      },
    });

    if (!result) {
      throw new NotFoundException('attendence not found');
    }

    const isExist = await this.prisma.attendance.findUnique({
      where: {
        date: data.date,
      },
    });

    if (isExist) {
      const date = new Date(data.date);
      throw new ConflictException(
        `${date.toLocaleDateString('en-US')} attendance already exist for ${
          data.month
        } month`,
      );
    }

    const updatedAttendence = await this.prisma.attendance.update({
      where: { id },
      data,
    });

    return updatedAttendence;
  }

  async deleteAttendence(id: string) {
    const result = await this.prisma.attendance.findUnique({
      where: {
        id,
      },
    });

    if (!result) {
      throw new NotFoundException('attendence not found');
    }
    await this.prisma.attendance.delete({
      where: { id },
    });
  }
}
