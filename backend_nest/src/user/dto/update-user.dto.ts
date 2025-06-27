import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";

export enum UserType {
  ADMIN = 'admin',
  DEVELOPER = 'developer',
  QA = 'qa',
  INTERN = 'intern',
}

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  username: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  role: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsEnum(UserType, { message: 'type must be one of: admin, developer, qa, intern' })
  type: string;
}
