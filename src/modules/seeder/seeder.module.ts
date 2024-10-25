import { Module } from '@nestjs/common';
import { SeederController } from './seeder.controller';
import { SeederService } from './seeder.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SeederController],
  providers: [SeederService],
})
export class SeederModule {}
