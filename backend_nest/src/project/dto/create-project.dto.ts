import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, ArrayNotEmpty, IsMongoId, IsString } from "class-validator";

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  members: string[];

  @ApiProperty()
  @IsMongoId()
  createdBy: string;
}
