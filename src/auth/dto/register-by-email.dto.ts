import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { IsValidUserTag } from "../../decorators/validate-tag.decorator";

export class RegisterByEmailDto {

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'Пароль слишком лёгкий'})
  password: string;

  @IsString()
  @MinLength(1)
  @MaxLength(20)
  name: string;
}