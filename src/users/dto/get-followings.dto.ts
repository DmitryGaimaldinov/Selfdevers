import { IsDate, IsNumber, IsOptional } from "class-validator";
import { IsUserId } from "../decorators/is-user-id.decorator";

export class GetFollowingsDto {
  @IsUserId()
  userId: number;
}