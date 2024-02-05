import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreateStudentDTO } from './dto/create-student.dto';
import { UserService } from './user.service';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { apiResponse } from 'src/shared/api-response';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/student')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Create Student',
    description: 'create student with valid information',
  })
  @ApiCreatedResponse({ type: CreateStudentDTO })
  async createStudent(@Body() studentData: CreateStudentDTO) {
    const result = await this.userService.createStudent(studentData);
    console.log(studentData);
    const responseObj = apiResponse<CreateStudentDTO>({
      statusCode: HttpStatus.CREATED,
      data: result,
      message: 'user created successfully',
    });

    return responseObj;
  }
}
