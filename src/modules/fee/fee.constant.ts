export const feeSearchAbleField = ['studentId', 'transactionId'];

export const feeFilterAbleField = [
  'searchTerm',
  'month',
  'year',
  'paymentType',
  'teacherId',
  'classId',
  'studentId',
];

export const feeRelationalFields: string[] = [
  'teacherId',
  'classId',
  'studentId',
];

export const feeRelationalFieldsMapper: { [key: string]: string } = {
  classId: 'class',
  teacherId: 'teacher',
  studentId: 'student',
};
