import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { subjectList } from './seeder.constant';

@Injectable()
export class SeederService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger();

  async seed() {
    this.seedingSubjects()
      .then(() => {
        this.logger.log('subjects created');
      })
      .catch((err) => this.logger.error('err: ', err));
  }

  async seedingSubjects() {
    return this.prisma.subject.createMany({ data: subjectList });
  }

  async retrievedSubjects() {
    return this.prisma.subject.findMany({
      select: { id: true },
    });
  }

  async seedingClasses(data) {
    return this.prisma.class.createMany({ data });
  }
}
