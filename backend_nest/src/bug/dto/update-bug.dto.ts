import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsOptional } from "class-validator";
import { IsEnum, IsString } from 'class-validator';

export enum Severity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  SEVERE = 'severe',
}

export enum Status {
  OPEN = 'open',
  IN_PROGRESS = 'in-progress',
  RESOLVED = 'resolved',
  POSTPONED = 'postponed',
}

export class UpdateBugDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsEnum(Severity, { message: 'type must be one of: low, medium, high, severe' })
  severity: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsEnum(Status, { message: 'type must be one of: open, in-progress, resolved, postponed' })
  status: string;

  @ApiProperty()
  @IsMongoId()
  @IsOptional()
  project: string;

  @ApiProperty()
  @IsMongoId()
  @IsOptional()
  reportedBy: string;
}
