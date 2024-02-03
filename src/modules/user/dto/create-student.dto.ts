import { BLOOD_GROUP, GENDER } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class NameDTO {
  @IsString({ message: 'first name must be string' })
  @IsNotEmpty({ message: 'first name is required' })
  firstName: string;

  @IsString({ message: 'middle name must be string' })
  @IsOptional()
  middleName: string;

  @IsString({ message: 'last name must be string' })
  @IsNotEmpty({ message: 'last name is required' })
  lastName: string;
}

export class GuardianDTO {
  @IsString({ message: 'father name must be string' })
  @IsNotEmpty({ message: 'father name is required' })
  fatherName: string;

  @IsString({ message: 'father occupation must be string' })
  @IsNotEmpty({ message: 'father occupation is required' })
  fatherOccupation: string;

  @IsString({ message: 'father contact no must be string' })
  @IsNotEmpty({ message: 'father contact no is required' })
  fatherContactNo: string;

  @IsString({ message: 'mother name must be string' })
  @IsNotEmpty({ message: 'mother name is required' })
  motherName: string;

  @IsString({ message: 'mother occupation must be string' })
  @IsNotEmpty({ message: 'mother occupation is required' })
  motherOccupation: string;

  @IsString({ message: 'mother contact no must be string' })
  @IsNotEmpty({ message: 'mother contact no is required' })
  motherContactNo: string;
}

export class CreateStudentDTO {
  @IsString({ message: 'student Id must be string' })
  @IsNotEmpty({ message: 'student Id is required' })
  studentId: string;

  @ValidateNested()
  @IsObject()
  @Type(() => NameDTO)
  name: NameDTO;

  @IsIn(Object.keys(GENDER))
  @IsNotEmpty({ message: 'gender must be required' })
  gender: GENDER;

  @IsDate({ message: 'date of birth must be in date format' })
  @IsNotEmpty({ message: 'date of birth is required' })
  @Type(() => Date)
  dateOfBirth: Date;

  @IsInt({ message: 'admission year must be number' })
  @IsNotEmpty({ message: 'admission year is required' })
  admissionYear: number;

  @ValidateNested()
  @IsObject()
  @Type(() => GuardianDTO)
  guardian: GuardianDTO;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString({ message: 'contact no must be string' })
  @IsOptional()
  contactNo: string;

  @IsNotEmpty({ message: 'blood group is required' })
  @IsIn(Object.keys(BLOOD_GROUP))
  bloodGroup: BLOOD_GROUP;

  @IsString({ message: 'class name must be string' })
  @IsNotEmpty({ message: 'class name is required' })
  className: string;

  @IsString({ message: 'class roll must be string' })
  @IsNotEmpty({ message: 'class roll is required' })
  classRoll: string;

  @IsString({ message: 'section must be string' })
  @IsNotEmpty({ message: 'section is required' })
  section: string;

  @IsString({ message: 'school name must be string' })
  @IsNotEmpty({ message: 'school name is required' })
  schoolName: string;

  @IsString({ message: 'image must be string' })
  @IsOptional()
  image: string;

  @IsString({ message: 'address must be string' })
  @IsNotEmpty({ message: 'address is required' })
  address: string;

  @IsOptional()
  shortDescription: string;
}
