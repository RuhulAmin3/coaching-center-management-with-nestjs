import { Student } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export class UserUtils {
  constructor(private readonly prismaService: PrismaService) {}
  generateStudentId(student: Student): string {
    const studentId = `S${student.section}${student.classRoll}-${student.className
      .substring(student.className.length - 2)
      .toUpperCase()}${student.admissionYear
      .toString()
      .substring(student.admissionYear.toString().length - 2)}`;
    return studentId;
  }

  async lastTeacherId(): Promise<string | undefined> {
    const lastId = await this.prismaService.user.findFirst({
      where: { role: 'TEACHER' },
      orderBy: {
        createdAt: 'desc',
      },
      select: { id: false, teacherId: true },
    });
    return lastId?.teacherId ? lastId?.teacherId.substring(2) : undefined;
  }

  async lastGuardianId(): Promise<string | undefined> {
    const lastId = await this.prismaService.user.findFirst({
      where: {
        role: 'GUARDIAN',
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        guardianId: true,
        id: false,
      },
    });

    return lastId?.guardianId ? lastId?.guardianId.substring(2) : undefined;
  }

  async generateTeacherId(): Promise<string> {
    const currentId =
      (await this.lastTeacherId()) || (0).toString().padStart(5, '0');
    let incrementId = (Number(currentId) + 1).toString().padStart(5, '0');
    incrementId = `T-${incrementId}`;
    return incrementId;
  }

  async generateGuardianId(): Promise<string> {
    const currentId =
      (await this.lastGuardianId()) || (0).toString().padStart(5, '0');
    let incrementId = (Number(currentId) + 1).toString().padStart(5, '0');
    incrementId = `G-${incrementId}`;
    return incrementId;
  }
}
