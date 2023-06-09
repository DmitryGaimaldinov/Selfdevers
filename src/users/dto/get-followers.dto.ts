import { IsDate, IsNumber, IsOptional } from "class-validator";

export class GetFollowersDto {
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsDate()
  beforeDate: Date;
}