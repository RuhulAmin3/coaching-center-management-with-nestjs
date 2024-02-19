import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDTO } from './dto/create-student.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createStudent(
    studentData: CreateStudentDTO,
    file: Express.Multer.File,
  ): Promise<CreateStudentDTO> {
    try {
      const { secure_url } =
        await this.cloudinaryService.uploadImageToCloud(file);
      console.log(secure_url);
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
