import { IsNumber } from "class-validator";

export class UnfollowDto {

  @IsNumber()
  followedUserId: number;
}