import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  PaginationMetaData,
  calculatePagination,
} from 'src/utils/calculatePagination';
import {
  noticeRelationFields,
  noticeRelationFieldsMapper,
} from './notice.constant';

@Injectable()
export class NoticeService {
  constructor(private readonly prisma: PrismaService) {}

  async addNotice(data) {
    const result = await this.prisma.notice.create({
      data,
      include: {
        author: {
          select: {
            teachers: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });
    return result;
  }

  async getNotice(id: string) {
    const result = await this.prisma.notice.findUnique({
      where: {
        id,
      },
      include: {
        author: {
          select: {
            teachers: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!result) {
      throw new NotFoundException('notice not found');
    }

    return result;
  }

  async getAllNotices(searchOptions, paginationOptions) {
    const { page, limit, sortBy, sortOrder, skip } =
      calculatePagination(paginationOptions);

    const { searchTerm, ...filterOptions } = searchOptions;
    const conditions = [];

    if (searchTerm) {
      conditions.push({
        OR: ['title', 'description'].map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        })),
      });
    }

    if (Object.keys(filterOptions).length > 0) {
      conditions.push({
        AND: Object.keys(filterOptions).map((key) => {
          if (noticeRelationFields.includes(key)) {
            return {
              [noticeRelationFieldsMapper[key]]: {
                id: filterOptions[key],
              },
            };
          } else {
            return {
              [key]: filterOptions[key],
            };
          }
        }),
      });
    }

    const finalCondition: Prisma.NoticeWhereInput =
      conditions.length > 0 ? { AND: conditions } : {};

    const result = await this.prisma.notice.findMany({
      where: finalCondition,

      skip: skip,
      take: limit,
      include: {
        author: {
          select: {
            teachers: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    const totalDoc = await this.prisma.notice.count({
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

  async updateNotice(id: string, updatedData: Prisma.NoticeUpdateInput) {
    const result = await this.prisma.notice.findUnique({
      where: {
        id,
      },
    });

    if (!result) {
      throw new NotFoundException('notice not found');
    }

    const updatedNotice = await this.prisma.notice.update({
      where: { id },
      data: updatedData,
      include: {
        author: {
          select: {
            teachers: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });
    return updatedNotice;
  }

  async deleteNotice(id: string) {
    const result = await this.prisma.notice.findUnique({
      where: {
        id,
      },
    });

    if (!result) {
      throw new NotFoundException('notice not found');
    }
    await this.prisma.notice.delete({
      where: { id },
    });
  }
}
