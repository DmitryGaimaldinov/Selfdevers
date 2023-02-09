import { IsBoolean } from "class-validator";

export class ChangePrivacyDto {
  @IsBoolean()
  isPrivate: boolean;
}