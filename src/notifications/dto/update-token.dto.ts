import { IsString } from "class-validator";

export class UpdateTokenDto {
  @IsString()
  token: string;
}