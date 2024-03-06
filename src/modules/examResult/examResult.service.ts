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
import { Prisma } from '@prisma/client';
import {
  examResultRelationalFields,
  examResultRelationalFieldsMapper,
  examResultSearchableFields,
} from './examResult.constant';
import { ExamResultUtils } from './examResult.utils';

@Injectable()
export class ExamResultService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly examResultUtils: ExamResultUtils,
  ) {}

  async createExamResult(data) {
    const isExamResultExist = await this.prisma.examResult.findFirst({
      where: {
        studentId: data.studentId,
        classId: data.classId,
        examId: data.examId,
      },
    });

    if (isExamResultExist) {
      throw new ConflictException('exam result already exist');
    }

    const updatedData = this.examResultUtils.updatedDataWithPointAndGrade(data);

    const result = await this.prisma.examResult.create({
      data: updatedData,
      include: {
        exam: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
    if (!result) throw new BadRequestException('failed to create exam');

    return result;
  }

  async getExamResult(id: string) {
    const result = await this.prisma.examResult.findUnique({
      where: {
        id,
      },
    });

    if (!result) {
      throw new NotFoundException('exam not found');
    }

    return result;
  }

  async getAllExamResult(searchOptions, paginationOptions) {
    const { page, limit, sortBy, sortOrder, skip } =
      calculatePagination(paginationOptions);

    const { searchTerm, ...filterOptions } = searchOptions;
    const conditions = [];

    if (searchTerm) {
      conditions.push({
        OR: examResultSearchableFields.map((field) => {
          return {
            [field]: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          };
        }),
      });
    }

    if (Object.keys(filterOptions).length > 0) {
      conditions.push({
        AND: Object.keys(filterOptions).map((key) => {
          if (examResultRelationalFields.includes(key)) {
            return {
              [examResultRelationalFieldsMapper[key]]: {
                id: filterOptions[key],
              },
            };
          } else {
            if (key === 'gpa') {
              return {
                [key]: +filterOptions[key],
              };
            }
            return {
              [key]: {
                contains: filterOptions[key],
                mode: 'insensitive',
              },
            };
          }
        }),
      });
    }

    const finalCondition: Prisma.ExamResultWhereInput =
      conditions.length > 0 ? { AND: conditions } : {};

    const result = await this.prisma.examResult.findMany({
      where: finalCondition,
      include: {
        class: {
          select: {
            id: true,
            className: true,
          },
        },
      },
      skip: skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    const totalDoc = await this.prisma.examResult.count({
      where: finalCondition,
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

  async updateExamResult(id: string, data) {
    const result = await this.prisma.examResult.findUnique({
      where: {
        id,
      },
    });

    if (!result) {
      throw new NotFoundException('exam result not found');
    }
    // update all the subject with grade and point
    const updatedData = this.examResultUtils.updatedDataWithPointAndGrade(data);

    const updatedExamResult = await this.prisma.examResult.update({
      where: { id },
      data: updatedData,
    });

    return updatedExamResult;
  }

  async deleteExamResult(id: string) {
    const result = await this.prisma.examResult.findUnique({
      where: {
        id,
      },
    });

    if (!result) {
      throw new NotFoundException('exam result not found');
    }
    await this.prisma.examResult.delete({
      where: { id },
    });
  }
}
