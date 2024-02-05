// response.service.ts
import { Injectable } from '@nestjs/common';
import { ApiResponseDto } from './api-response.dto';

@Injectable()
export class ApiResponseService {
  ApiResponse<T>(data: ApiResponseDto<T>) {
    const responseData: ApiResponseDto<T> = {
      message: data.message,
      meta: data.meta || null,
      data: data.data || null,
    };
    return responseData;
  }
}
