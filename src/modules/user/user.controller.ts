import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { CreateStudentDTO } from './dto/create-student.dto';
import { UserService } from './user.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateStudentEntity } from './entity/create-student.entity';
import { apiResponse } from 'src/shared/api-response';

@Controller('/user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/student')
  @ApiCreatedResponse({ type: CreateStudentEntity })
  async createStudent(@Body() studentData: CreateStudentDTO) {
    const result = await this.userService.createStudent(studentData);

    const responseObj = apiResponse<CreateStudentDTO>({
      statusCode: HttpStatus.CREATED,
      data: result,
      message: 'user created successfully',
    });

    return responseObj;
  }
}
