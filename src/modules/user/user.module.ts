import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { SharedModule } from 'src/shared/share.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { UserUtils } from './user.utils';

@Module({
  imports: [PrismaModule, SharedModule, CloudinaryModule],
  controllers: [UserController],
  providers: [UserService, UserUtils],
  exports: [],
})
export class UserModule {}
