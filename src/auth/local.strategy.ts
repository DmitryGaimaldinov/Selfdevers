import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "./auth.service";
import { rethrow } from "@nestjs/core/helpers/rethrow";
import { User } from "../users/entities/user.entity";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  // Сверяет, правильный ли email и пароль.
  // То, что возвращается в return, добавляется к Request'у как поле user.
  async validate(email: string, password: string): Promise<any> {
    console.log(`email: ${email}, password: ${password}`);
    const user = await this.authService.validateUserLocal(email, password);
    console.log(`user in validation: ${JSON.stringify(user)}`);
    return user;
  }
}