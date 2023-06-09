import { IsUserId } from "../decorators/is-user-id.decorator";

export class UnfollowDto {
  @IsUserId()
  userId: number;
}