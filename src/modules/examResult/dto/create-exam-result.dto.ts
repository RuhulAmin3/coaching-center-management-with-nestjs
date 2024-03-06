import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsPositive,
  ValidateNested,
} from 'class-validator';

class ExamResultSubject {
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty()
  totalMark: number;

  @IsNotEmpty()
  @IsPositive()
  @ApiProperty()
  obtainedMark: number;

  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty()
  subjectId: string;
}

export class CreateExamResultDTO {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  studentId: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  examId: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  classId: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ApiProperty()
  @Type(() => ExamResultSubject)
  subjects: ExamResultSubject[];
}

export class UpdateExamResultDTO extends PartialType(CreateExamResultDTO) {}
