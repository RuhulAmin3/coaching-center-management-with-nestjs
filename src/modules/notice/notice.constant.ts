export const queryOptions = ['searchTerm', 'title', 'description', 'authorId'];

export const noticeRelationFields: string[] = ['authorId'];

export const noticeRelationFieldsMapper: { [key: string]: string } = {
  authorId: 'author',
};
