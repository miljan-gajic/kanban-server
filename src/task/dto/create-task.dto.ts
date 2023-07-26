import { Status } from '@prisma/client';
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
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
  @IsDefined()
  status: Status;
}
