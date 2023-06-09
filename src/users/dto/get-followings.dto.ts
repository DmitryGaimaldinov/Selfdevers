import { IsDate, IsNumber, IsOptional } from "class-validator";

export class GetFollowingsDto {
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsDate()
  beforeDate: Date;
}