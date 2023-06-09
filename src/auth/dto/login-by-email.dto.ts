import { IsEmail, IsString } from "class-validator";
import { RemoveLineBreaks } from "../../utils/decorators/remove-line-breaks.decorator";

export class LoginByEmailDto {

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}