export const queryOptions = [
  'searchTerm',
  'title',
  'class',
  'month',
  'classId',
  'authorId',
];
export const examRelationalFields: string[] = ['classId', 'authorId'];
export const examRelationalFieldsMapper: { [key: string]: string } = {
  classId: 'class',
  authorId: 'author',
};
