import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty } from "class-validator";
import { IsEnum, IsString } from 'class-validator';
import { Severity, Status } from "../bugEnums";

export class CreateBugDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEnum(Severity, { message: 'type must be one of: low, medium, high, severe' })
  severity: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEnum(Status, { message: 'type must be one of: open, in-progress, resolved, postponed' })
  status: string;

  @ApiProperty()
  @IsMongoId()
  project: string;

  @ApiProperty()
  @IsMongoId()
  reportedBy: string;
}
