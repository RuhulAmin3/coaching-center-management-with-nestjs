import {
  ApiProperty,
  ApiPropertyOptional,
  ApiResponseProperty,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { NameDTO } from './create-student.dto';
import { BLOOD_GROUP, GENDER } from '@prisma/client';

class EducationalQualificationDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'gender must be required' })
  universityName: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiPropertyOptional()
  @IsOptional()
  result: string;

  @ApiProperty()
  @IsString()
  graduation: string;

  @ApiPropertyOptional()
  @IsPositive()
  @IsOptional()
  completedYear: number;
}

export class CreateTeacherDTO {
  @ApiResponseProperty()
  @IsOptional()
  id: string;

  @IsOptional()
  @ApiProperty()
  teacherId: string;

  @ValidateNested()
  @IsObject()
  @Type(() => NameDTO)
  @ApiProperty()
  name: NameDTO;

  @IsIn(Object.keys(GENDER))
  @IsNotEmpty({ message: 'gender must be required' })
  @ApiProperty({ enum: Object.keys(GENDER) })
  gender: GENDER;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString({ message: 'contact no must be string' })
  @ApiProperty()
  contactNo: string;

  @IsNotEmpty({ message: 'blood group is required' })
  @IsIn(Object.keys(BLOOD_GROUP))
  @ApiProperty({ enum: Object.keys(BLOOD_GROUP) })
  bloodGroup: BLOOD_GROUP;

  @ApiProperty()
  @IsString({ message: 'designation must be string' })
  @IsNotEmpty({ message: 'designation is required' })
  designation: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'salary is required' })
  @IsPositive({ message: 'salary must be positive number' })
  salary: number;

  @IsString({ message: 'subject must be string' })
  @IsNotEmpty({ message: 'subject is required' })
  @ApiProperty()
  subject: string;

  @ApiProperty()
  @ValidateNested()
  @IsObject()
  @Type(() => EducationalQualificationDTO)
  educationalQualification: EducationalQualificationDTO;

  @IsString({ message: 'image must be string' })
  @IsOptional()
  @ApiPropertyOptional()
  image: string;

  @IsDate({ message: 'date of birth must be in date format' })
  @IsNotEmpty({ message: 'date of birth is required' })
  @Type(() => Date)
  @ApiProperty()
  dateOfBirth: Date;

  @IsString({ message: 'address must be string' })
  @IsNotEmpty({ message: 'address is required' })
  @ApiProperty()
  address: string;

  @IsOptional()
  @ApiPropertyOptional()
  shortDescription: string;
}
