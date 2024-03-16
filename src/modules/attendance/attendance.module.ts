import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AttendenceController } from './attendance.controller';
import { AttendenceService } from './attendance.service';

@Module({
  imports: [PrismaModule],
  controllers: [AttendenceController],
  providers: [AttendenceService],
})
export class AttendenceModule {}
