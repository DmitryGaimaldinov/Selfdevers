import { CanActivate, ExecutionContext, Injectable, Scope } from "@nestjs/common";
import { isString } from "@nestjs/common/utils/shared.utils";
import { IncorrectInputError } from "../../errors/incorrect-input.error";
import { UsersService } from "../users.service";
import { transformUserTag } from "../transform-user-tag-pipe";


// Здесь не работает trimPipe и UserTagPipe. Так что можно сделать UserTagValidationPipe
@Injectable()
export class UserTagGuard implements CanActivate {
  constructor(
    private usersService: UsersService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const request = context.switchToHttp().getRequest();
    const currentUser = request.user;
    console.log(`currentUser: ${JSON.stringify(currentUser)}`);
    let userTag = request.body.userTag;

    if (!isString(userTag)) {
      throw new IncorrectInputError('Тэг должен быть строкой');
    }

    userTag = transformUserTag(userTag);

    if (userTag.length < 3 || userTag.length > 20) {
      throw new IncorrectInputError('Длина тега должна быть от 3 до 20 символов');
    }

    if(!/^[a-zA-Z0-9_]+$/.test(userTag)) {
      throw new IncorrectInputError('Тэг пользователя может содержать только английские символы, цифры и подчёркивания');
    }

    if (userTag.startsWith('id')) {
      const idFromTag = +userTag.substring(2);
      if (currentUser.id !== idFromTag) {
        throw new IncorrectInputError(`Недопустимый тэг пользователя. Можно только id${currentUser.id}`);
      }
    }

    const user = await this.usersService.findOneBy({ userTag }, null);
    if (user && (user.id != currentUser.id)) {
      throw new IncorrectInputError('Извините, данный тег занят');
    }

    return true;
  }
}