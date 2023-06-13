import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { RegisterByEmailDto } from "./dto/register-by-email.dto";
import { AuthResultDto } from "./dto/auth-result.dto";
import { User } from "../users/entities/user.entity";
import { JwtPayload } from "./jwt-payload";
import { IncorrectInputError } from "../errors/incorrect-input.error";
import { EntityNotFoundError } from "../errors/entity-not-found.error";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async registerByEmail(registerDto: RegisterByEmailDto): Promise<AuthResultDto> {
    // Создаём пользователя в базе данных
    const createdUser = await this.usersService.create({ ...registerDto });

    // Генерируем токены
    const tokens = await this.generateTokens(createdUser.id);

    // Возвращаем токены и какую-то информацию
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: createdUser,
    };
  }

  async login(user: User): Promise<AuthResultDto> {
    const tokens = await this.generateTokens(user.id);
    const userDto = await this.usersService.findOneBy({ id: user.id }, user.id);

    // Возвращаем токены и какую-то информацию о пользователе
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: userDto,
    }
  }

  /**
   * Генерирует access и refresh токены
   */
  async generateTokens(userId: number): Promise<{accessToken: string, refreshToken: string}> {
    const payload: JwtPayload = { sub: userId };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '60m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '60d' });
    await this.setUserToken(userId, refreshToken);

    return {
      accessToken,
      refreshToken,
    }
  }

  /// Записать refreshToken для пользователя
  async setUserToken(userId: number, refreshToken: string) {
    await this.userRepo.update(userId, { refreshToken });
  }

  async refreshTokens(refreshToken: string) {
    const userId = this.jwtService.decode(refreshToken).sub;
    const user = await this.userRepo.findOneBy({ id: userId });

    if (user.refreshToken != refreshToken) {
      throw new UnauthorizedException('Сессия недействительна');
    }

    return await this.generateTokens(user.id);
  }


  /**
   * Авторизация по email и паролю.
   * Возвращает пользователя, если такой зарегестрирован.
   */
  async validateUserLocal(email: string, password: string): Promise<User> {
    // Выдаём ошибку, если нет пользователя с таким email
    const user = await this.userRepo.findOneBy( { email });
    if (!user) {
      throw new IncorrectInputError('Пользователь с таким e-mail не зарегестрирован');
    }

    // Выдаём ошибку, если неверный пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new IncorrectInputError('Неверный пароль');
    }

    return user;
  }

  async validateUserJwt(userId: number): Promise<User> {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new EntityNotFoundError('Пользователь не найден');
    }

    return user;
  }

  /// Если токен валидный, возвращает айди пользователя, которому он принадлежит
  async verifyToken(jwtToken: string): Promise<number | null> {
    try {
      const verifiedDecodedToken = this.jwtService.verify(jwtToken);
      return verifiedDecodedToken['sub'];
    } catch (e) {
      return null;
    }
  }
}
