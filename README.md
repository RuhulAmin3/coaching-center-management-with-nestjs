# Starting with Center management application backend

### Role based Feature of Center management application

#### Student:

- Students can login and logout (account will be provide by admin)
- Students can make a request to the admin to update their profile.
- Students can see their transaction (payment) histories.
- Students can see their exam results.
- Students can see guardian Account active status.
- Students can see their monthly attendance.

#### Teacher:

- Teachers can login and logout (account will be provide by admin)
- Teachers can see their transaction (payment) histories.
- Teachers can see their attendance histories.

#### Guardian:

- Guardian can request the admin to create an account if the admin approved then the account will be active. (guardian must have valid or admitted student Id)
- Guardian can see the transaction history of their childrens.
- Guardian can see the exam result report of their childrens.
- The Guardian can see their student Information.
- The Guardian can see their children's attendance.

#### Admin:

- Admin can login and logout.
- Admin can manage and update their profile.
- Admin will provide user (student, teacher, guardian) accounts.
- Admin can approve or reject Guardian requested accounts.
- Admin can manage (CRUD) user (student, teacher, guardian) accounts.
- Admin can manage (CRUD) classes.
- Admin can manage (CRUD) exams.
- Admin can collect fees.
- Admin can add expense.
- Manage students' attendance.

### Explanation of the using technologies.

- I am using Nestjs to making REST API.
- Prisma for declare schema and mongodb as a database with typescript for type safety.
- JWT token for user authentication validation.

### API documentation

#### subject Api

- /api/v1/subject (POST) ====> create class api endpoint.
- /api/v1/subject (GET) ====> get all class api endpoint by search, filter and pagination.
  search_query:searchTerm=title (e.g class?searchTerm=mathematics)
  filter_query:title=title (e.g class?title=mathematics&code=102)

- /api/v1/subject/:id (GET) ====> get single class api endpoint.
- /api/v1/subject/:id (PATCH) ====> update specific class api endpoint.
- /api/v1/subject/:id (DELETE) ====> delete class api endpoint.

#### class Api

- /api/v1/class (POST) ====> create class api endpoint.
- /api/v1/class (GET) ====> get all class api endpoint by search, filter and pagination.
  search_query:searchTerm=className (e.g class?searchTerm=nine)
  filter_query:className=className (e.g class?className=nine)

- /api/v1/class/:id (GET) ====> get single class api endpoint.
- /api/v1/class/:id (PATCH) ====> update specific class api endpoint.
- /api/v1/class/:id (DELETE) ====> delete class api endpoint.

#### exam Api

- /api/v1/exam (POST) ====> create exam api endpoint.

- /api/v1/exam (GET) ====> get all exam api endpoint by search, filter and pagination.  
  (search by title, className and filter by title and classId)
  search_query:searchTerm=title&className (e.g exam?searchTerm=weekly Exam, exam?searchTerm=nine)
  filter_query:title=title &classId=classId &month=month (e.g exam?title=Monthly Exam&classId=65d81233300545d443ecf489&month=January)

- /api/v1/exam/:id (GET) ====> get single exam api endpoint.
- /api/v1/exam/:id (PATCH) ====> update specific exam api endpoint.
- /api/v1/exam/:id (DELETE) ====> delete exam api endpoint.

#### exam result Api

- /api/v1/exam-result (POST) ====> create exam-result api endpoint.

- /api/v1/exam-result (GET) ====> get all exam-result api endpoint by search, filter and pagination.  
  (search by grade)
  search_query:searchTerm=grade(e.g exam-result?searchTerm=A)
  filter_query:gpa=gpa&grade=grade&studentId=studentId&classId=classId&examId=examId (e.g exam-result?studentId=65d329bc396476d2e1eadc2a, exam-result?classId=65d81233300545d443ecf489&grade=A)

- /api/v1/exam-result/:id (GET) ====> get single exam-result api endpoint.
- /api/v1/exam-result/:id (PATCH) ====> update specific exam-result api endpoint.
- /api/v1/exam-result/:id (DELETE) ====> delete exam-result api endpoint.

#### student Api

- /api/v1/student (GET) ====> get all student api endpoint by search, filter and pagination.
  search_query:searchTerm=studentId&className&classRoll&schoolName (e.g student?searchTerm=eleven, searchTerm=SB11-EN21)
  filter_query:fieldName=studentId&gender&className&classRoll&schoolName&bloodGroup&admissionYear&status (e.g class?className=Eleven&admissionYear=2021)

- /api/v1/student/:id (GET) ====> get single student api endpoint.
- /api/v1/student/:id (PATCH) ====> update specific student api endpoint.
- /api/v1/student/:id (DELETE) ====> delete student api endpoint.

#### Teacher Api

- /api/v1/teacher (GET) ====> get all teacher api endpoint by search, filter and pagination.
  search_query:searchTerm=teacherId&email&designation&contactNo (e.g teacher?searchTerm=T-00001, searchTerm=math teacher)
  filter_query:fieldName=teacherId&gender&email&designation&subject&conatactNo&salary&type (e.g teacher?teacherId=T-00001&type=monthly)

- /api/v1/teacher/:id (GET) ====> get single teacher api endpoint.
- /api/v1/teacher/:id (PATCH) ====> update specific teacher api endpoint.
- /api/v1/teacher/:id (DELETE) ====> delete teacher api endpoint.

#### Guardian Api

- /api/v1/guardian (GET) ====> get all teacher api endpoint by search, filter and
  pagination.
  search_query:searchTerm=guardianId&contactNo&occupation (e.g guardian?searchTerm=G-00001, searchTerm=businessman)
  filter_query:fieldName=guardianId&gender&conatactNo&occupation&accountStatus (e.g guardian?guardianId=G-00001&occupation=farmer&accountStatus=Pending)

- /api/v1/guardian/:id (GET) ====> get single guardian api endpoint.
- /api/v1/guardian/:id (PATCH) ====> update specific guardian api endpoint.
- /api/v1/guardian/:id (DELETE) ====> delete guardian api endpoint.

#### expense Api

- /api/v1/expense (POST) ====> create expense api endpoint.
- /api/v1/expense (GET) ====> get all expense api endpoint by search, filter and pagination.
  search_query:searchTerm=title&year (e.g expense?searchTerm=2023)
  filter_query:fieldName=title&status&type&amount&pay&month&year&teacherId (e.g expense?title=salary for sumon sir&type=salary)

- /api/v1/expense/:id (GET) ====> get single expense api endpoint.
- /api/v1/expense/:id (PATCH) ====> update specific expense api endpoint.
- /api/v1/expense/:id (DELETE) ====> delete expense api endpoint.

#### notice Api

- /api/v1/notice (POST) ====> create notice api endpoint.
- /api/v1/notice (GET) ====> get all notice api endpoint by search, filter and pagination.
  search_query:searchTerm=title&description (e.g notice?searchTerm=exam notice)
  filter_query:fieldName=authorId&status(e.g notice?authorId=65d43425069dd2dadc694e2a&status=Pending)

- /api/v1/notice/:id (GET) ====> get single notice api endpoint.
- /api/v1/notice/:id (PATCH) ====> update specific notice api endpoint.
- /api/v1/notice/:id (DELETE) ====> delete notice api endpoint.

#### Attendance Api

- /api/v1/attendence (POST) ====> create attendence api endpoint.
- /api/v1/attendence (GET) ====> get all attendence for admin view api endpoint by filter and pagination. filter_query:fieldName=month&year&classId(e.g attendence?month=January&year=2024&classId=65d70a43e5378abb4218fa3e)

- /api/v1/attendence/:id (GET) ====> get single attendence api endpoint.
- /api/v1/attendence/student/:id?month=july&year=2024 (GET) ====> get specific month attendence api endpoint for a student. (id should be student id)
- /api/v1/attendence/:id (PATCH) ====> update specific attendence api endpoint.
- /api/v1/attendence/:id (DELETE) ====> delete attendence api endpoint.

#### fee Api

- /api/v1/fee (POST) ====> create fee api endpoint.
- /api/v1/fee (GET) ====> get all fee api endpoint by search, filter and pagination.
  search_query:searchTerm=studentId&transactionId (e.g fee?searchTerm=SC06-EN20)
  filter_query:fieldName=month&year&paymentType&teacherId&studentId&classId(e.g fee?month=December&year=2023&paymentType=Offline&teacherId=65d43426069dd2dadc694e2b&studentId=65d329bc396476d2e1eadc2a&classId=65d70a43e5378abb4218fa3e)

- /api/v1/fee/:id (GET) ====> get single fee api endpoint.
- /api/v1/fee/:id (PATCH) ====> update specific fee api endpoint.
- /api/v1/fee/:id (DELETE) ====> delete fee api endpoint.

#### leaderboard Api

- /api/v1/leaderboard (GET) ====> monthly leaderboard api endpoint.
  query:{classId, month, year}
- /api/v1/leaderboard/year (GET) ====> yearly leaderboard api endpoint.
  query:{classId, monthLength, year}

### Technology

- TypeScript
- NestJs
- Mongodb
- Prisma
- swagger
- JWT
- Passport.Js
- Nodemailer

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
