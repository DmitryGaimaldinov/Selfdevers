import { IsNumber } from "class-validator";

export class GetFollowersCountDto {
  @IsNumber()
  userId: number;
}