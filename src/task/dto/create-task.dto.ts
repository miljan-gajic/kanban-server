import { Status } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTaskDto {
  @MinLength(10)
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  title: string;

  @MinLength(10)
  @MaxLength(500)
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(Status)
  @IsOptional()
  status: Status;
}
