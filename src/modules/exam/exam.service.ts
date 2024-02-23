import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { calculatePagination } from 'src/utils/calculatePagination';
import { Prisma } from '@prisma/client';
import {
  examRelationalFields,
  examRelationalFieldsMapper,
} from './exam.constant';

@Injectable()
export class ExamService {
  constructor(private readonly prisma: PrismaService) {}
  async createExam(data) {
    const result = await this.prisma.exam.create({
      data,
      include: {
        class: {
          select: {
            id: true,
            className: true,
          },
        },
      },
    });
    if (!result) throw new BadRequestException('failed to create exam');

    return result;
  }

  async getExam(id: string) {
    const result = await this.prisma.exam.findUnique({
      where: {
        id,
      },
      include: {
        class: {
          select: {
            id: true,
            className: true,
          },
        },
      },
    });

    if (!result) {
      throw new NotFoundException('exam not found');
    }

    return result;
  }

  async getAllExam(searchOptions, paginationOptions) {
    const { page, limit, sortBy, sortOrder, skip } =
      calculatePagination(paginationOptions);

    const { searchTerm, ...filterOptions } = searchOptions;
    const conditions = [];

    if (searchTerm) {
      conditions.push({
        OR: ['title', 'class'].map((field) => {
          if (field == 'class') {
            return {
              [field]: {
                className: {
                  contains: searchTerm,
                  mode: 'insensitive',
                },
              },
            };
          }
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
          if (examRelationalFields.includes(key)) {
            return {
              [examRelationalFieldsMapper[key]]: {
                id: filterOptions[key],
              },
            };
          } else {
            return {
              [key]: {
                equals: filterOptions[key],
              },
            };
          }
        }),
      });
    }

    const finalCondition: Prisma.ExamWhereInput =
      conditions.length > 0 ? { AND: conditions } : {};

    const result = await this.prisma.exam.findMany({
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

    const totalDoc = await this.prisma.exam.count({
      where: finalCondition,
    });

    const totalPages = Math.ceil(totalDoc / +limit);
    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;
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

  async updateExam(id: string, updatedData) {
    const result = await this.prisma.exam.findUnique({
      where: {
        id,
      },
    });

    if (!result) {
      throw new NotFoundException('exam not found');
    }

    const updatedExam = await this.prisma.exam.update({
      where: { id },
      data: updatedData,
    });

    return updatedExam;
  }

  async deleteExam(id: string) {
    const result = await this.prisma.exam.findUnique({
      where: {
        id,
      },
    });

    if (!result) {
      throw new NotFoundException('exam not found');
    }
    await this.prisma.exam.delete({
      where: { id },
    });
  }
}
