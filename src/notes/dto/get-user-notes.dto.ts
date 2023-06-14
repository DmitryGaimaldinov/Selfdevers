import { IsUserId } from "../../users/decorators/is-user-id.decorator";
import { IsOptional, IsString } from "class-validator";

export class GetUserNotesDto {
  @IsString()
  userTag: string;
}