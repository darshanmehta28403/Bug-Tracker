import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, ArrayNotEmpty, IsMongoId, IsString } from "class-validator";

export class UpdateProjectDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  @IsMongoId({ each: true })
  members: string[];
}
