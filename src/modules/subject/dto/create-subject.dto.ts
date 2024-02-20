import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
export class CreateSubjectDTO {
  @IsOptional()
  @ApiResponseProperty()
  id: string;

  @IsString()
  @IsNotEmpty({ message: 'title must be required' })
  @ApiProperty()
  title: string;
}

export class UpdateSubjectDTO extends PartialType(CreateSubjectDTO) {}
