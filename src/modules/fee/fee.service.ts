import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  PaginationMetaData,
  calculatePagination,
} from 'src/utils/calculatePagination';
import {
  feeRelationalFields,
  feeRelationalFieldsMapper,
  feeSearchAbleField,
} from './fee.constant';

@Injectable()
export class FeeService {
  constructor(private readonly prisma: PrismaService) {}

  async addStudentFee(data) {
    const result = await this.prisma.fee.create({
      data,
    });
    return result;
  }

  async getStudentFee(id: string) {
    const result = await this.prisma.fee.findUnique({
      where: {
        id,
      },
    });

    if (!result) {
      throw new NotFoundException('student fee not found');
    }

    return result;
  }

  async getAllStudentFees(searchOptions, paginationOptions) {
    const { page, limit, sortBy, sortOrder, skip } =
      calculatePagination(paginationOptions);

    const { searchTerm, ...filterOptions } = searchOptions;
    const conditions = [];

    if (searchTerm) {
      conditions.push({
        OR: feeSearchAbleField.map((field) => {
          if (field === 'studentId') {
            return {
              student: {
                studentId: searchTerm,
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
          if (feeRelationalFields.includes(key)) {
            return {
              [feeRelationalFieldsMapper[key]]: {
                id: filterOptions[key],
              },
            };
          } else {
            if (key === 'year') {
              return {
                [key]: +filterOptions[key],
              };
            }
            return {
              [key]: filterOptions[key],
            };
          }
        }),
      });
    }

    const finalCondition: Prisma.FeeWhereInput =
      conditions.length > 0 ? { AND: conditions } : {};

    const result = await this.prisma.fee.findMany({
      where: finalCondition,
      skip: skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    if (result.length === 0) {
      throw new NotFoundException(' any fees record not found');
    }

    const totalDoc = await this.prisma.fee.count({
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

  async updateFee(id: string, updatedData) {
    const result = await this.prisma.fee.findUnique({
      where: {
        id,
      },
    });

    if (!result) {
      throw new NotFoundException('fee not found');
    }

    const updatedFee = await this.prisma.fee.update({
      where: { id },
      data: updatedData,
    });

    return updatedFee;
  }

  async deleteFee(id: string) {
    const result = await this.prisma.fee.findUnique({
      where: {
        id,
      },
    });

    if (!result) {
      throw new NotFoundException('fee not found');
    }
    await this.prisma.fee.delete({
      where: { id },
    });
  }
}
