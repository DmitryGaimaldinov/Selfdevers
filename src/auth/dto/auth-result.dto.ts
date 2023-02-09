import { Expose } from "class-transformer";

export class AuthResultDto {

  id: number;

  name: string;

  email: string;

  userTag: string;

  accessToken: string;

  refreshToken: string;
}