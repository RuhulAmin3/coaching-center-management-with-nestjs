type IApiResponse<T> = {
  success?: true;
  statusCode: number;
  message?: string | null;

  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalDoc?: number;
    totalPages?: number;
    prevPage?: number;
    nextpage?: number;
  };
  data?: T | null;
};

export const apiResponse = <T>(data: IApiResponse<T>) => {
  const responseData: IApiResponse<T> = {
    success: true,
    statusCode: data.statusCode,
    message: data.message || null,
    meta: data.meta || null,
    data: data.data || null,
  };
  return responseData;
};
