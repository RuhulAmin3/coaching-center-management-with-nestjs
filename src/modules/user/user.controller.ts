import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreateStudentDTO } from './dto/create-student.dto';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { JsonParseInterceptor } from 'src/common/interceptors/jsonParseInterceptor';
import { multerOptions } from 'src/common/multerOptions/multerOptions';

@Controller('/user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/student')
  @UseInterceptors(
    FileInterceptor('file', multerOptions),
    new JsonParseInterceptor('student'),
  )
  async createStudent(
    @UploadedFile() file: Express.Multer.File,
    @Body('student') student: CreateStudentDTO,
  ) {
    await this.userService.createStudent(student, file);
    // const responseObj = apiResponse<CreateStudentDTO>({
    //   statusCode: HttpStatus.CREATED,
    //   data: result,
    //   message: 'user created successfully',
    // });
    return { studentData: 'success' };
  }
}
