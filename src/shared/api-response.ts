type IApiResponse<T> = {
  statusCode: number;
  message?: string | null;
  success?: true;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
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
    meta: data.meta,
    data: data.data || null,
  };
  return responseData;
};
