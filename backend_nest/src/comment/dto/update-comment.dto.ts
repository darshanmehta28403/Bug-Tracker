import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsString, IsOptional } from "class-validator";

export class UpdateCommentDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  text: string;

  @ApiProperty()
  @IsMongoId()
  @IsOptional()
  author: string;
}
