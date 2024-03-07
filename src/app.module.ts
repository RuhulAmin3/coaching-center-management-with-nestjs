import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { SubjectModule } from './modules/subject/subject.module';
import { ClassModule } from './modules/class/class.module';
import { ExamModule } from './modules/exam/exam.module';
import { StudentModule } from './modules/student/student.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { GuardianModule } from './modules/guardian/guardian.module';
import { ExpenseModule } from './modules/expense/expense.module';
import { ExamResultModule } from './modules/examResult/examResult.module';
import { NoticeModule } from './modules/notice/notice.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    SubjectModule,
    ClassModule,
    ExamModule,
    StudentModule,
    TeacherModule,
    GuardianModule,
    ExpenseModule,
    ExamResultModule,
    NoticeModule,
    ConfigModule.forRoot({
      load: configuration,
      isGlobal: true,
      expandVariables: true,
    }),
    PrismaModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
