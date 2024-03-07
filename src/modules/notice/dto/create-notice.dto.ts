import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNoticeDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsMongoId()
  @IsOptional()
  @ApiProperty()
  authorId: string;

  @IsString()
  @ApiProperty()
  description: string;
}

export class UpdateNoticeDTO extends PartialType(CreateNoticeDTO) {}
