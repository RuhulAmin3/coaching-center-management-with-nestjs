import { PartialType } from '@nestjs/mapped-types';
import {
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateClassDTO {
  @IsString()
  @IsNotEmpty({ message: 'class name is required' })
  className: string;

  @IsArray()
  @IsNotEmpty({ message: 'subjects is required' })
  @IsMongoId({ each: true, message: 'subjectIds must be a mongodb id' })
  @ArrayMinSize(1)
  subjectIds: string[];

  @IsOptional()
  @IsArray()
  studentIds: string[];
}

export class UpdateClassDTO extends PartialType(CreateClassDTO) {}
