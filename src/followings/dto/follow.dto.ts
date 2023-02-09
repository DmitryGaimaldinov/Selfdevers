import { IsNumber, IsString } from "class-validator";

export class FollowDto {

  @IsNumber()
  followedUserId: number;
}