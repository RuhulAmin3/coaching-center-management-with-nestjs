import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  PaginationMetaData,
  calculatePagination,
} from 'src/utils/calculatePagination';
import { expenseSearchAbleField } from './expense.constant';

@Injectable()
export class ExpenseService {
  constructor(private readonly prisma: PrismaService) {}

  async addExpense(data) {
    const result = await this.prisma.expense.create({
      data,
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return result;
  }

  async getExpense(id: string) {
    const result = await this.prisma.expense.findUnique({
      where: {
        id,
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!result) {
      throw new NotFoundException('expense not found');
    }

    return result;
  }

  async getAllExpenses(searchOptions, paginationOptions) {
    const { page, limit, sortBy, sortOrder, skip } =
      calculatePagination(paginationOptions);

    const { searchTerm, ...filterOptions } = searchOptions;
    const conditions = [];

    if (searchTerm) {
      conditions.push({
        OR: expenseSearchAbleField.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        })),
      });
    }

    if (Object.keys(filterOptions).length > 0) {
      conditions.push({
        AND: Object.entries(filterOptions).map(([field, value]) => ({
          [field]: value,
        })),
      });
    }

    const finalCondition: Prisma.ExpenseWhereInput =
      conditions.length > 0 ? { AND: conditions } : {};

    const result = await this.prisma.expense.findMany({
      where: finalCondition,
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      skip: skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    const totalDoc = await this.prisma.expense.count({
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

  async updateExpense(id: string, updatedData) {
    const result = await this.prisma.expense.findUnique({
      where: {
        id,
      },
    });

    if (!result) {
      throw new NotFoundException('expense not found');
    }

    const updatedExpense = await this.prisma.expense.update({
      where: { id },
      data: updatedData,
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return updatedExpense;
  }

  async deleteExpense(id: string) {
    const result = await this.prisma.expense.findUnique({
      where: {
        id,
      },
    });

    if (!result) {
      throw new NotFoundException('expanse not found');
    }
    await this.prisma.expense.delete({
      where: { id },
    });
  }
}
