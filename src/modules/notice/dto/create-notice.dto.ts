import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { NOTICE_STATUS } from '@prisma/client';
import {
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

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

  @IsIn(Object.keys(NOTICE_STATUS))
  @IsOptional()
  status: NOTICE_STATUS;
}

export class UpdateNoticeDTO extends PartialType(CreateNoticeDTO) {}
