import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { ExpenseStatus, ExpenseType, MONTH } from '@prisma/client';
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

export class CreateExpenseDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsIn(Object.keys(ExpenseType))
  @ApiProperty()
  type: string;

  @IsNotEmpty()
  @IsIn(Object.keys(MONTH))
  @ApiProperty()
  month: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  year: string;

  @IsNotEmpty()
  @IsPositive()
  @ApiProperty()
  amount: number;

  @IsNotEmpty()
  @IsPositive()
  @ApiProperty()
  pay: number;

  @IsPositive()
  @IsOptional()
  @ApiProperty()
  due: number;

  @IsNotEmpty()
  @IsIn(Object.keys(ExpenseStatus))
  @ApiProperty()
  status: string;

  @IsMongoId()
  @IsOptional()
  @ApiProperty()
  teacherId: string;

  @IsNotEmpty()
  @IsDate()
  @ApiProperty()
  @Type(() => Date)
  date: Date;

  @IsOptional()
  @IsString()
  @ApiProperty()
  shortDescription: string;
}

export class UpdateExpenseDTO extends PartialType(CreateExpenseDTO) {}
