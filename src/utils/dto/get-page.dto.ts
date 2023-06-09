import { IsDate, IsNumber, IsOptional } from "class-validator";

export class GetPageDto {
  @IsNumber()
  limit: number;

  @IsOptional()
  @IsDate()
  nextCursor: Date;
}