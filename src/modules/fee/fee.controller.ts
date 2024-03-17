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
import { CreateFeeDTO, UpdateFeeDTO } from './dto/create-fee.dto';
import { FeeService } from './fee.service';
import { feeFilterAbleField } from './fee.constant';

@Controller('/fee')
export class FeeController {
  constructor(private readonly feeService: FeeService) {}

  @Post()
  @ApiCreatedResponse({ type: CreateFeeDTO })
  @ApiOperation({ description: 'add fee endpoints' })
  async addFee(@Body() feeData: CreateFeeDTO) {
    const result = await this.feeService.addStudentFee(feeData);
    const response = apiResponse({
      statusCode: HttpStatus.CREATED,
      data: result,
      message: 'Fee added successfully',
    });
    return response;
  }

  @Get()
  @ApiOkResponse({ type: [CreateFeeDTO] })
  @ApiOperation({ description: 'get all fee endpoints' })
  async getAllFees(@Query() query: Record<string, any>) {
    const paginationsFields = queryPick(query, paginationOptions);
    const searchOptions = queryPick(query, feeFilterAbleField);

    const result = await this.feeService.getAllStudentFees(
      searchOptions,
      paginationsFields,
    );

    const response = apiResponse({
      statusCode: HttpStatus.OK,
      data: result.data,
      meta: result.meta,
      message: 'all fees retrieved successfully',
    });
    return response;
  }

  @Get('/:id')
  @ApiOkResponse({ type: CreateFeeDTO })
  @ApiOperation({ description: 'get fee endpoints' })
  async getFee(@Param('id') id: string) {
    const result = await this.feeService.getStudentFee(id);

    const response = apiResponse({
      statusCode: HttpStatus.OK,
      data: result,
      message: 'fee retrieve successfully',
    });
    return response;
  }

  @Patch('/:id')
  @ApiOkResponse({ type: UpdateFeeDTO })
  @ApiOperation({ description: 'update fee endpoints' })
  async updateFee(@Param('id') id: string, @Body() data: UpdateFeeDTO) {
    const result = await this.feeService.updateFee(id, data);

    const response = apiResponse({
      statusCode: HttpStatus.OK,
      data: result,
      message: 'fee updated successfully',
    });
    return response;
  }

  @Delete('/:id')
  @ApiOkResponse()
  @ApiOperation({ description: 'delete Fee endpoints' })
  async deleteFee(@Param('id') id: string) {
    const result = await this.feeService.deleteFee(id);

    const response = apiResponse({
      statusCode: HttpStatus.OK,
      data: result,
      message: 'fee deleted successfully',
    });
    return response;
  }
}
