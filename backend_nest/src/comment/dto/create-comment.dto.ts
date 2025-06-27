import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsMongoId, IsString } from "class-validator";

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty()
  @IsMongoId()
  author: string;

  @ApiProperty()
  @IsMongoId()
  bug: string;

  @ApiProperty()
  @IsMongoId()
  project: string;
}
