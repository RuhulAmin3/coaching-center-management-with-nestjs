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
import { CreateNoticeDTO, UpdateNoticeDTO } from './dto/create-notice.dto';
import { apiResponse } from 'src/utils/api-response';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { queryPick } from 'src/utils/queryPick';
import { paginationOptions } from 'src/constants/paginationOptions';
import { NoticeService } from './notice.service';
import { queryOptions } from './notice.constant';

@Controller('/notice')
@ApiTags('Notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Post()
  @ApiCreatedResponse({ type: CreateNoticeDTO })
  @ApiOperation({ description: 'add notice endpoints' })
  async addNotice(@Body() noticeData: CreateNoticeDTO) {
    const result = await this.noticeService.addNotice(noticeData);
    const response = apiResponse({
      statusCode: HttpStatus.CREATED,
      data: result,
      message: 'notice added successfully',
    });
    return response;
  }

  @Get()
  @ApiOkResponse({ type: [CreateNoticeDTO] })
  @ApiOperation({ description: 'get all notice endpoints' })
  async getNotices(@Query() query: Record<string, any>) {
    const paginationsFields = queryPick(query, paginationOptions);
    const searchOptions = queryPick(query, queryOptions);

    const result = await this.noticeService.getAllNotices(
      searchOptions,
      paginationsFields,
    );

    const response = apiResponse({
      statusCode: HttpStatus.OK,
      data: result.data,
      meta: result.meta,
      message: 'all notices retrieve successfully',
    });
    return response;
  }

  @Get('/:id')
  @ApiOkResponse({ type: CreateNoticeDTO })
  @ApiOperation({ description: 'single notice get endpoints' })
  async getNotice(@Param('id') id: string) {
    const result = await this.noticeService.getNotice(id);

    const response = apiResponse({
      statusCode: HttpStatus.OK,
      data: result,
      message: 'notice retrieved successfully',
    });
    return response;
  }

  @Patch('/:id')
  @ApiOkResponse({ type: CreateNoticeDTO })
  @ApiOperation({ description: 'notice update endpoints' })
  async updateNotice(@Param('id') id: string, @Body() data: UpdateNoticeDTO) {
    const result = await this.noticeService.updateNotice(id, data);
    const response = apiResponse({
      statusCode: HttpStatus.OK,
      data: result,
      message: 'notice update successfully',
    });
    return response;
  }

  @Delete('/:id')
  @ApiOkResponse()
  @ApiOperation({ description: 'notice delete endpoints' })
  async deleteNotice(@Param('id') id: string) {
    await this.noticeService.deleteNotice(id);
    const response = apiResponse({
      statusCode: HttpStatus.OK,
      message: 'notice deleted successfully',
    });
    return response;
  }
}
