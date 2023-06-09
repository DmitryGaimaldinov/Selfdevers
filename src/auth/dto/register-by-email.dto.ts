import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { UserNameValidator } from "../../users/decorators/is-valid-user-name.decorator";
import { Transform } from "class-transformer";

export class RegisterByEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'Пароль слишком лёгкий'})
  password: string;

  @UserNameValidator()
  name: string;
}