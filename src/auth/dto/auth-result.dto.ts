import { UserDto } from "../../users/dto/user.dto";

export class AuthResultDto {

  user: UserDto;

  accessToken: string;

  refreshToken: string;
}