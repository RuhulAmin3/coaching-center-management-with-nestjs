export const queryOptions = [
  'searchTerm',
  'classId',
  'studentId',
  'examId',
  'grade',
  'gpa',
];

export const examResultSearchableFields: string[] = ['grade'];

export const examResultRelationalFields: string[] = [
  'classId',
  'studentId',
  'examId',
];

export const examResultRelationalFieldsMapper: { [key: string]: string } = {
  classId: 'class',
  studentId: 'student',
  examId: 'exam',
};
