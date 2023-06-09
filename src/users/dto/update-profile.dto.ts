import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";
import { UserNameValidator } from "../decorators/is-valid-user-name.decorator";
import { UserDescriptionValidator } from "../decorators/is-valid-user-description.decorator";

export class UpdateProfileDto {
  @IsOptional()
  @UserNameValidator()
  name: string;

  @IsOptional()
  @IsString()
  userTag: string;

  @IsOptional()
  @IsString()
  @UserDescriptionValidator()
  description: string;

  @IsOptional()
  @IsBoolean()
  isPrivate: boolean;
}