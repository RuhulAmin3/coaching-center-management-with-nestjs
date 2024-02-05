import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BLOOD_GROUP, GENDER, Student } from '@prisma/client';
import { Type } from 'class-transformer';
export class Name {
  @ApiProperty()
  firstName: string;

  @ApiPropertyOptional()
  middleName: string;

  @ApiProperty()
  lastName: string;
}

export class Guardian {
  @ApiProperty()
  fatherName: string;

  @ApiProperty()
  fatherOccupation: string;

  @ApiProperty()
  fatherContactNo: string;

  @ApiProperty()
  motherName: string;

  @ApiProperty()
  motherOccupation: string;

  @ApiProperty()
  motherContactNo: string;
}

export class CreateStudentEntity implements Student {
  @ApiProperty()
  id: string;

  @ApiProperty()
  studentId: string;

  @ApiProperty()
  @Type(() => Name)
  name: Name;

  @ApiProperty({ enum: Object.keys(GENDER) })
  gender: GENDER;

  @ApiProperty()
  @Type(() => Date)
  dateOfBirth: Date;

  @ApiProperty()
  admissionYear: number;

  @ApiProperty()
  @Type(() => Guardian)
  guardian: Guardian;

  @ApiPropertyOptional()
  email: string;

  @ApiPropertyOptional()
  contactNo: string;

  @ApiProperty({ enum: Object.keys(BLOOD_GROUP) })
  bloodGroup: BLOOD_GROUP;

  @ApiProperty()
  className: string;

  @ApiProperty()
  classRoll: string;

  @ApiProperty()
  section: string;

  @ApiProperty()
  schoolName: string;

  @ApiPropertyOptional()
  image: string;

  @ApiProperty()
  address: string;

  @ApiPropertyOptional()
  shortDescription: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
