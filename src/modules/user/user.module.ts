import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { SharedModule } from 'src/shared/share.module';

@Module({
  imports: [PrismaModule, SharedModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [],
})
export class UserModule {}
