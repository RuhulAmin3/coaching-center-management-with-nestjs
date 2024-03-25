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
import { ClassService } from './class.service';
import { queryOptions } from './class.constant';
import { CreateClassDTO, UpdateClassDTO } from './dto/create-class.dto';
import { HasRoles } from '../auth/decorator/roles.decorator';
import { ROLE } from '@prisma/client';

@Controller('/class')
@ApiTags('Class')
@HasRoles(ROLE.ADMIN)
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  @ApiCreatedResponse({ type: CreateClassDTO })
  @ApiOperation({ description: 'add class endpoints' })
  async addNewClass(@Body() classData: CreateClassDTO) {
    const result = await this.classService.addNewClass(classData);
    const response = apiResponse({
      statusCode: HttpStatus.CREATED,
      data: result,
      message: 'class added successfully',
    });
    return response;
  }

  @Get()
  @ApiOkResponse({ type: [CreateClassDTO] })
  @ApiOperation({ description: 'get all classes endpoints' })
  async getClasses(@Query() query: Record<string, any>) {
    const paginationsFields = queryPick(query, paginationOptions);
    const searchOptions = queryPick(query, queryOptions);

    const result = await this.classService.getAllClasses(
      searchOptions,
      paginationsFields,
    );

    const response = apiResponse({
      statusCode: HttpStatus.OK,
      data: result.data,
      meta: result.meta,
      message: 'all classes retrieve successfully',
    });
    return response;
  }

  @Get('/:id')
  @ApiOkResponse({ type: CreateClassDTO })
  @ApiOperation({ description: 'single class get endpoints' })
  async getClass(@Param('id') id: string) {
    const result = await this.classService.getClass(id);
    const response = apiResponse({
      statusCode: HttpStatus.OK,
      data: result,
      message: 'class retrieved successfully',
    });
    return response;
  }

  @Patch('/:id')
  @ApiOkResponse({ type: CreateClassDTO })
  @ApiOperation({ description: 'class update endpoints' })
  async updateClass(@Param('id') id: string, @Body() data: UpdateClassDTO) {
    const result = await this.classService.updateClass(id, data);
    const response = apiResponse({
      statusCode: HttpStatus.OK,
      data: result,
      message: 'class update successfully',
    });
    return response;
  }

  @Delete('/:id')
  @ApiOkResponse()
  @ApiOperation({ description: 'class delete endpoints' })
  async deleteClass(@Param('id') id: string) {
    await this.classService.deleteClass(id);
    const response = apiResponse({
      statusCode: HttpStatus.OK,
      message: 'class deleted successfully',
    });
    return response;
  }
}
