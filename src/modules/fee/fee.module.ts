import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FeeController } from './fee.controller';
import { FeeService } from './fee.service';

@Module({
  imports: [PrismaModule],
  controllers: [FeeController],
  providers: [FeeService],
})
export class FeeModule {}
