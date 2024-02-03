import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDTO } from './dto/create-student.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createStudent(
    studentData: CreateStudentDTO,
  ): Promise<CreateStudentDTO> {
    try {
      const createdUser = await this.prismaService.student.create({
        data: studentData,
      });
      return createdUser;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err);
    }
  }
}
