import {
  Body,
  Controller,
  HttpStatus,
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
import { apiResponse } from 'src/utils/api-response';
import { CreateTeacherDTO } from './dto/create-teacher.dto';
import { CreateGuardianDTO } from './dto/create-guardian.dto';

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
    @Body('password') password: string,
  ) {
    const result = await this.userService.createStudent(
      student,
      file,
      password,
    );
    const responseObj = apiResponse<CreateStudentDTO>({
      statusCode: HttpStatus.CREATED,
      data: result,
      message: 'student created successfully',
    });
    return responseObj;
  }

  @Post('/teacher')
  @UseInterceptors(
    FileInterceptor('file', multerOptions),
    new JsonParseInterceptor('teacher'),
  )
  async createTeacher(
    @UploadedFile() file: Express.Multer.File,
    @Body('teacher') teacher: CreateTeacherDTO,
    @Body('password') password: string,
  ) {
    const result = await this.userService.createTeacher(
      teacher,
      file,
      password,
    );

    const responseObj = apiResponse<CreateTeacherDTO>({
      statusCode: HttpStatus.CREATED,
      data: result,
      message: 'teacher created successfully',
    });
    return responseObj;
  }

  @Post('/guardian')
  @UseInterceptors(
    FileInterceptor('file', multerOptions),
    new JsonParseInterceptor('guardian'),
  )
  async createGuardian(
    @UploadedFile() file: Express.Multer.File,
    @Body('guardian') guardian: CreateGuardianDTO,
  ) {
    const { password, ...restData } = guardian;
    const result = await this.userService.createGuardian(
      restData,
      file,
      password,
    );

    const responseObj = apiResponse<Omit<CreateGuardianDTO, 'password'>>({
      statusCode: HttpStatus.CREATED,
      data: result,
      message: 'guardian created successfully',
    });
    return responseObj;
  }
}
