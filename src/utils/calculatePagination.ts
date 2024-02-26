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

export const PaginationMetaData = (
  page: number,
  totalDoc: number,
  limit: number,
) => {
  const totalPages = Math.ceil(totalDoc / +limit);
  const nextPage = page < totalPages ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;
  return { totalPages, nextPage, prevPage };
};
