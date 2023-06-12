import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { Observable } from "rxjs";
import { jwtConstants } from "../constants";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "../auth.service";
import { Socket } from "socket.io";
import { User } from "../../users/entities/user.entity";

@Injectable()
export class WsApplyUserGuard implements CanActivate {

  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();
    const token = client.handshake.query.token;

    let user: User | null = null;

    if (token) {
      try {
        const verifiedToken = this.jwtService.verify(token as string);
        user = await this.authService.validateUserJwt(verifiedToken['sub']);
      } catch (ex) {

      }
    }

    client.data.user = user;
    return true;
  }
}