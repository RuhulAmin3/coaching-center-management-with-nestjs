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
import { AttendenceService } from './attendance.service';
import {
  CreateAttendenceDTO,
  UpdateAttendenceDTO,
} from './dto/create-attendance.dto';
import { queryOptions } from './attendance.constant';

@Controller('/attendence')
@ApiTags('Attendence')
export class AttendenceController {
  constructor(private readonly attendenceService: AttendenceService) {}

  @Post()
  @ApiCreatedResponse({ type: CreateAttendenceDTO })
  @ApiOperation({ description: 'add attendence endpoints' })
  async addAttendence(@Body() attendenceData: CreateAttendenceDTO) {
    const result = await this.attendenceService.addAttendence(attendenceData);
    const response = apiResponse({
      statusCode: HttpStatus.CREATED,
      data: result,
      message: 'attendence added successfully',
    });
    return response;
  }

  @Get()
  @ApiOkResponse({ type: [CreateAttendenceDTO] })
  @ApiOperation({ description: 'get all attendences endpoints' })
  async getAttendenceForAdmin(@Query() query: Record<string, any>) {
    const paginationsFields = queryPick(query, paginationOptions);
    const searchOptions = queryPick(query, queryOptions);

    const result = await this.attendenceService.getAttendenceForAdmin(
      searchOptions,
      paginationsFields,
    );

    const response = apiResponse({
      statusCode: HttpStatus.OK,
      data: result.data,
      meta: result.meta,
      message: 'all attendences retrieve successfully for admin',
    });
    return response;
  }

  @Get('/student/:id')
  @ApiOkResponse({ type: [CreateAttendenceDTO] })
  @ApiOperation({ description: 'students get attendences endpoints' })
  async getAttendenceForStudent(
    @Param('id') id: string,
    @Query() query: Record<string, any>,
  ) {
    const paginationsFields = queryPick(query, paginationOptions);
    const searchOptions = queryPick(query, queryOptions);

    const result = await this.attendenceService.getStudentAttendence(
      id,
      searchOptions,
      paginationsFields,
    );

    const response = apiResponse({
      statusCode: HttpStatus.OK,
      data: result.data,
      meta: result.meta,
      message: 'all attendences retrieve successfully for single student',
    });
    return response;
  }

  @Get('/:id')
  @ApiOkResponse({ type: CreateAttendenceDTO })
  @ApiOperation({ description: 'single attendence get endpoints' })
  async getAttendence(@Param('id') id: string) {
    const result = await this.attendenceService.getAttendence(id);

    const response = apiResponse({
      statusCode: HttpStatus.OK,
      data: result,
      message: 'attendence retrieved successfully',
    });
    return response;
  }

  @Patch('/:id')
  @ApiOkResponse({ type: CreateAttendenceDTO })
  @ApiOperation({ description: 'attendence update endpoints' })
  async updateAttendence(
    @Param('id') id: string,
    @Body() data: UpdateAttendenceDTO,
  ) {
    const result = await this.attendenceService.updateAttendence(id, data);
    const response = apiResponse({
      statusCode: HttpStatus.OK,
      data: result,
      message: 'attendence update successfully',
    });
    return response;
  }

  @Delete('/:id')
  @ApiOkResponse()
  @ApiOperation({ description: 'attendence delete endpoints' })
  async deleteAttendence(@Param('id') id: string) {
    await this.attendenceService.deleteAttendence(id);
    const response = apiResponse({
      statusCode: HttpStatus.OK,
      message: 'attendence deleted successfully',
    });
    return response;
  }
}
