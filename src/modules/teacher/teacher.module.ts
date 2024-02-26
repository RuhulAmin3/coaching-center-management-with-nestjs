import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TeacherControler } from './teacher.controller';
import { TeacherService } from './teacher.service';

@Module({
  imports: [PrismaModule],
  controllers: [TeacherControler],
  providers: [TeacherService],
})
export class TeacherModule {}
