import { IsNumber, IsString } from "class-validator";
import { IsUserId } from "../../users/decorators/is-user-id.decorator";

export class FollowDto {

  @IsUserId()
  userId: number;
}