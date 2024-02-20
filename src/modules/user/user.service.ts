import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UserUtils } from './user.utils';
import { Prisma, ROLE } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly userUtils: UserUtils,
    private readonly configService: ConfigService,
  ) {}

  async createStudent(
    studentData: Prisma.StudentCreateInput,
    file: Express.Multer.File,
    password: string | undefined | null,
  ) {
    // set user data
    const userData: Prisma.UserCreateInput = {
      password: password
        ? password
        : this.configService.get('USER.student_pass'),
      role: ROLE.STUDENT,
    };

    // create student new id by his own data
    const studentId = this.userUtils.generateStudentId(studentData);
    const isExistStudent = await this.prismaService.student.findUnique({
      where: {
        studentId: studentId,
      },
    });
    if (isExistStudent) {
      throw new ConflictException(
        'student already exist with this information',
      );
    }
    userData['studentId'] = studentId;
    studentData.studentId = studentId;
    try {
      // const { secure_url } =
      //   await this.cloudinaryService.uploadImageToCloud(file);
      studentData.image =
        'https://res.cloudinary.com/dwykyqzzk/image/upload/v1708335326/zbsav7bbwwtvpvo70mkb.jpg';

      const result = await this.prismaService.$transaction(async (tsx) => {
        const user = await tsx.user.create({
          data: userData,
        });

        studentData['userId'] = user.id;

        const createdStudent = await tsx.student.create({
          data: studentData,
        });

        // remove password from user
        // if (createdStudent?.user) {
        //   const userExceptPassword = excludeField(createdStudent.user, [
        //     'password',
        //   ]);
        //   createdStudent.user = userExceptPassword;
        // }

        return createdStudent;
      });

      return result;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
  async createTeacher(
    teacherData: Prisma.TeacherCreateInput,
    file: Express.Multer.File,
    password: string | undefined | null,
  ) {
    // set user data
    const userData: Prisma.UserCreateInput = {
      password: password
        ? password
        : this.configService.get('USER.teacher_pass'),
      role: ROLE.TEACHER,
    };

    // generate teacher Id
    const teacherId = await this.userUtils.generateTeacherId();

    userData['teacherId'] = teacherId;
    teacherData.teacherId = teacherId;
    try {
      // const { secure_url } =
      //   await this.cloudinaryService.uploadImageToCloud(file);
      teacherData.image =
        'https://res.cloudinary.com/dwykyqzzk/image/upload/v1708335326/zbsav7bbwwtvpvo70mkb.jpg';

      const result = await this.prismaService.$transaction(async (tsx) => {
        const user = await tsx.user.create({
          data: userData,
        });

        teacherData['userId'] = user.id;

        const createTeacher = await tsx.teacher.create({
          data: teacherData,
        });
        return createTeacher;
      });

      return result;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
