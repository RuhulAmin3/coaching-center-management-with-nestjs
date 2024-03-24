import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

class ExamSubject {
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty()
  totalMark: number;

  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty()
  subjectId: string;
}

export class CreateExamDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty({ message: 'exam date is required' })
  @IsDate()
  @ApiProperty()
  @Type(() => Date)
  date: Date;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  classId: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  authorId: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ApiProperty()
  @Type(() => ExamSubject)
  subjects: ExamSubject[];
}

export class UpdateExamDTO extends PartialType(CreateExamDTO) {}
