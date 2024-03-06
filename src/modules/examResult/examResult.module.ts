import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ExamResultService } from './examResult.service';
import { ExamResultController } from './examResult.controller';
import { ExamResultUtils } from './examResult.utils';

@Module({
  imports: [PrismaModule],
  controllers: [ExamResultController],
  providers: [ExamResultService, ExamResultUtils],
})
export class ExamResultModule {}
