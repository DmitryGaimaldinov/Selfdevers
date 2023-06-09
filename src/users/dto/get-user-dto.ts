import { IsOptional, IsString } from "class-validator";
import { FindUserOptionalField } from "./find-user-optional-field";

export class GetUserDto {
  @IsString()
  userTag: string;
}