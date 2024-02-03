import { Body, Controller, Post } from '@nestjs/common';
import { CreateStudentDTO } from './dto/create-student.dto';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('/student')
  async createStudent(@Body() studentData: CreateStudentDTO) {
    const result = await this.userService.createStudent(studentData);

    return result;
  }
}
