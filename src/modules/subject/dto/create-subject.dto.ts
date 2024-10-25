import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateSubjectDTO {
  @IsOptional()
  @ApiResponseProperty()
  id: string;

  @IsInt({ message: 'subject code must be number' })
  @IsNotEmpty({ message: 'subject code is required' })
  code: number;

  @IsString()
  @IsNotEmpty({ message: 'title must be required' })
  @ApiProperty()
  title: string;
}

export class UpdateSubjectDTO extends PartialType(CreateSubjectDTO) {}
