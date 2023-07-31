import { Role, type User } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserDto implements User {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Exclude()
  hash: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsOptional()
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsOptional()
  lastName: string;

  @IsOptional()
  @IsEnum(Role)
  role: Role;

  @Exclude()
  hashedRt: string;

  @IsDate()
  @IsOptional()
  createdAt: Date;

  @IsDate()
  @IsOptional()
  updatedAt: Date;

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
