import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { MONTH, PaymentType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateFeeDTO {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty()
  classId: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  studentId: string;

  @IsMongoId()
  @ApiProperty()
  @IsNotEmpty()
  teacherId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsIn(Object.values(MONTH))
  @ApiProperty()
  @IsNotEmpty()
  month: MONTH;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  year: number;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  total: number;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  pay: number;

  @ApiProperty()
  @IsNotEmpty()
  due: number;

  @IsIn(Object.values(PaymentType))
  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  paymentType: PaymentType;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  transactionId: string;

  @IsString()
  @ApiProperty()
  description: string;
}

export class UpdateFeeDTO extends PartialType(CreateFeeDTO) {}
