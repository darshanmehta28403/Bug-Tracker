import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsOptional } from "class-validator";
import { IsEnum, IsString } from 'class-validator';
import { Severity, Status } from "../bugEnums";

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
  @IsOptional()
  @IsEnum(Severity, { message: 'type must be one of: low, medium, high, severe' })
  severity: Severity;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Status, { message: 'type must be one of: open, in-progress, resolved, postponed' })
  status: Status;

  @ApiProperty()
  @IsMongoId()
  @IsOptional()
  project: string;

  @ApiProperty()
  @IsMongoId()
  @IsOptional()
  reportedBy: string;
}
