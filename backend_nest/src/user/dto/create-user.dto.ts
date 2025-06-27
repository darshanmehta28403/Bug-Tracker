import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { IsEnum, IsString } from 'class-validator';

export enum UserType {
  ADMIN = 'admin',
  DEVELOPER = 'developer',
  QA = 'qa',
  INTERN = 'intern',
}

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  plainPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEnum(UserType, { message: 'type must be one of: admin, developer, qa, intern' })
  type: string;
}
