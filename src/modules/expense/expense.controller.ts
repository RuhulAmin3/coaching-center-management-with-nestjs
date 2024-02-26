import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { queryPick } from 'src/utils/queryPick';
import { paginationOptions } from 'src/constants/paginationOptions';
import { apiResponse } from 'src/utils/api-response';
import { ExpenseService } from './expense.service';
import { expenseFilterAbleField } from './expense.constant';
import { CreateExpenseDTO, UpdateExpenseDTO } from './dto/create-expense.dto';

@Controller('/expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @ApiCreatedResponse({ type: CreateExpenseDTO })
  @ApiOperation({ description: 'add expense endpoints' })
  async addExpense(@Body() expenseData: CreateExpenseDTO) {
    const result = await this.expenseService.addExpense(expenseData);
    const response = apiResponse({
      statusCode: HttpStatus.CREATED,
      data: result,
      message: 'Expense added successfully',
    });
    return response;
  }

  @Get()
  @ApiOkResponse({ type: [CreateExpenseDTO] })
  @ApiOperation({ description: 'get all expense endpoints' })
  async getAllExpense(@Query() query: Record<string, any>) {
    const paginationsFields = queryPick(query, paginationOptions);
    const searchOptions = queryPick(query, expenseFilterAbleField);

    const result = await this.expenseService.getAllExpenses(
      searchOptions,
      paginationsFields,
    );

    const response = apiResponse({
      statusCode: HttpStatus.OK,
      data: result.data,
      meta: result.meta,
      message: 'all expenses retrieved successfully',
    });
    return response;
  }

  @Get('/:id')
  @ApiOkResponse({ type: CreateExpenseDTO })
  @ApiOperation({ description: 'get expense endpoints' })
  async getExpense(@Param('id') id: string) {
    const result = await this.expenseService.getExpense(id);

    const response = apiResponse({
      statusCode: HttpStatus.OK,
      data: result,
      message: 'Expense retrieve successfully',
    });
    return response;
  }

  @Patch('/:id')
  @ApiOkResponse({ type: UpdateExpenseDTO })
  @ApiOperation({ description: 'update expense endpoints' })
  async updateExpense(@Param('id') id: string, @Body() data: UpdateExpenseDTO) {
    const result = await this.expenseService.updateExpense(id, data);

    const response = apiResponse({
      statusCode: HttpStatus.OK,
      data: result,
      message: 'expense updated successfully',
    });
    return response;
  }

  @Delete('/:id')
  @ApiOkResponse()
  @ApiOperation({ description: 'delete expense endpoints' })
  async deleteExpense(@Param('id') id: string) {
    const result = await this.expenseService.deleteExpense(id);

    const response = apiResponse({
      statusCode: HttpStatus.OK,
      data: result,
      message: ' expense deleted successfully',
    });
    return response;
  }
}
