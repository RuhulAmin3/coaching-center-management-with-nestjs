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
import { apiResponse } from 'src/utils/api-response';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { queryPick } from 'src/utils/queryPick';
import { paginationOptions } from 'src/constants/paginationOptions';
import { ExamResultService } from './examResult.service';
import {
  CreateExamResultDTO,
  UpdateExamResultDTO,
} from './dto/create-exam-result.dto';
import { queryOptions } from './examResult.constant';
import { HasRoles } from '../auth/decorator/roles.decorator';
import { ROLE } from '@prisma/client';

@Controller('/exam-result')
@ApiTags('Exam Result')
@HasRoles(ROLE.ADMIN, ROLE.TEACHER)
export class ExamResultController {
  constructor(private readonly examResultService: ExamResultService) {}

  @Post()
  @ApiCreatedResponse({ type: CreateExamResultDTO })
  @ApiOperation({ description: 'add exam result endpoints' })
  async addExamResult(@Body() examData: CreateExamResultDTO) {
    const result = await this.examResultService.createExamResult(examData);
    const response = apiResponse({
      statusCode: HttpStatus.CREATED,
      data: result,
      message: 'exam result added successfully',
    });
    return response;
  }

  @Get()
  @ApiOkResponse({ type: [CreateExamResultDTO] })
  @ApiOperation({ description: 'get all exams result endpoints' })
  async getExamResults(@Query() query: Record<string, any>) {
    const paginationsFields = queryPick(query, paginationOptions);
    const searchOptions = queryPick(query, queryOptions);

    const result = await this.examResultService.getAllExamResult(
      searchOptions,
      paginationsFields,
    );

    const response = apiResponse({
      statusCode: HttpStatus.OK,
      data: result.data,
      meta: result.meta,
      message: 'all exams result retrieve successfully',
    });
    return response;
  }

  @Get('/:id')
  @ApiOkResponse({ type: CreateExamResultDTO })
  @ApiOperation({ description: 'single exam result get endpoints' })
  async getExamResult(@Param('id') id: string) {
    const result = await this.examResultService.getExamResult(id);

    const response = apiResponse({
      statusCode: HttpStatus.OK,
      data: result,
      message: 'exam result retrieved successfully',
    });
    return response;
  }

  @Patch('/:id')
  @ApiOkResponse({ type: CreateExamResultDTO })
  @ApiOperation({ description: 'Exam result update endpoints' })
  async updateExamResult(
    @Param('id') id: string,
    @Body() data: UpdateExamResultDTO,
  ) {
    const result = await this.examResultService.updateExamResult(id, data);
    const response = apiResponse({
      statusCode: HttpStatus.OK,
      data: result,
      message: 'exam result update successfully',
    });
    return response;
  }

  @Delete('/:id')
  @ApiOkResponse()
  @ApiOperation({ description: 'Exam delete endpoints' })
  async deleteExamResult(@Param('id') id: string) {
    await this.examResultService.deleteExamResult(id);
    const response = apiResponse({
      statusCode: HttpStatus.OK,
      message: 'exam result deleted successfully',
    });
    return response;
  }
}
