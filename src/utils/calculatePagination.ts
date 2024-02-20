type IOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
};

type IReturnOptions = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
};

export const calculatePagination = (options: IOptions): IReturnOptions => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || 'createdAt';
  const sortOrder = options.sortOrder || 'desc';
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};
