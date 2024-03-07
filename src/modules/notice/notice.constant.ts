export const queryOptions = [
  'searchTerm',
  'title',
  'description',
  'authorId',
  'status',
];

export const noticeRelationFields: string[] = ['authorId'];

export const noticeRelationFieldsMapper: { [key: string]: string } = {
  authorId: 'author',
};
