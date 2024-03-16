import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { MONTH } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsBoolean,
  IsDate,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

class AttendanceStudents {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isPresent: boolean;

  @ApiProperty()
  @IsNotEmpty()
  name: string;
}

export class CreateAttendenceDTO {
  @IsString()
  @ApiProperty()
  @IsNotEmpty({ message: 'class id is required' })
  @IsMongoId()
  classId: string;

  @IsIn(Object.values(MONTH))
  @IsNotEmpty()
  @ApiProperty()
  month: MONTH;

  @IsNotEmpty()
  @IsPositive()
  @ApiProperty()
  year: number;

  @IsNotEmpty({ message: 'exam date is required' })
  @IsDate()
  @ApiProperty()
  @Type(() => Date)
  date: Date;

  @IsString()
  @IsNotEmpty({ message: 'teacher id is required' })
  @IsMongoId()
  @ApiProperty()
  teacherId: string;

  @ValidateNested()
  @ApiProperty()
  @ArrayMinSize(1)
  @Type(() => AttendanceStudents)
  students: AttendanceStudents[];
}

export class UpdateAttendenceDTO extends PartialType(CreateAttendenceDTO) {}
