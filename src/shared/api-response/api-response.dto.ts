// api-response.dto.ts
export class ApiResponseDto<T> {
  //   success: true;
  //   statusCode: number;
  message: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    prevPage?: number;
    nextPage?: number;
  };
  data: T | null;
}
