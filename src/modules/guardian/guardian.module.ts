import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { GuardianService } from './guardian.service';
import { GuadianController } from './guardian.controller';

@Module({
  imports: [PrismaModule],
  controllers: [GuadianController],
  providers: [GuardianService],
})
export class GuardianModule {}
