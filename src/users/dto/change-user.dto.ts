import { IsNumber, IsOptional, IsString } from "class-validator";

export class ChangeUserDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  userTag: string;

  @IsOptional()
  @IsString()
  description: string;
}