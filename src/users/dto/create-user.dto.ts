import { User } from "../entities/user.entity";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  email: string;
  password: string;
  name: string;
}