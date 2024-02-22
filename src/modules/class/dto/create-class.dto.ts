import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClassDTO {
  @IsString()
  @IsNotEmpty({ message: 'class name is required' })
  className: string;

  @IsArray()
  @IsNotEmpty({ message: 'subjects is required' })
  subjectIds: string[];

  @IsOptional()
  @IsArray()
  studentIds: string[];
}

export class UpdateClassDTO extends PartialType(CreateClassDTO) {}
