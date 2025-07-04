import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional } from "class-validator";

export class PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  page: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  limit: number;
}
