import { Body, Controller, ForbiddenException, Get, Post, Req, SerializeOptions, UseGuards } from "@nestjs/common";
import { RegisterByEmailDto } from "./dto/register-by-email.dto";
import { AuthService } from "./auth.service";
import { AuthResultDto } from "./dto/auth-result.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";
import { User } from "../users/entities/user.entity";
import { LoginByEmailDto } from "./dto/login-by-email.dto";
import { Request } from "express";
import { RefreshTokensDto } from "./dto/refresh-tokens.dto";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterByEmailDto): Promise<AuthResultDto> {
    return await this.authService.registerByEmail(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request): Promise<AuthResultDto> {
    return await this.authService.login(req.user as User);
  }

  @Post('refresh-tokens')
  async refreshTokens(@Body() refreshTokensDto: RefreshTokensDto) {
    return this.authService.refreshTokens(refreshTokensDto.refreshToken);
  }
}