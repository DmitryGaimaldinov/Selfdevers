import {
  IsNumber,
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";
import { IncorrectInputError } from "../../errors/incorrect-input.error";
import { applyDecorators, Inject, Injectable, Scope } from "@nestjs/common";
import { isString } from "@nestjs/common/utils/shared.utils";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { UsersService } from "../users.service";
import { UserDto } from "../dto/user.dto";

@ValidatorConstraint({ name: 'IsUserIdConstraint', async: true })
@Injectable()
export class IsUserIdConstraint implements ValidatorConstraintInterface {
  constructor(
    private usersService: UsersService,
  ) {}

  async validate(userIdString: string, args: ValidationArguments): Promise<boolean> {
    if (!userIdString) {
      throw new IncorrectInputError(`Не указан идентификатор пользователя`);
    }
    const userId = Number.parseInt(userIdString);
    if (Number.isNaN(userId)) {
      throw new IncorrectInputError(`Указанный идентификатор пользователя ${userIdString} не является числом`);
    }

    const user: UserDto | null = await this.usersService.findOneBy({ id: userId }, null);
    if (!user) {
      throw new IncorrectInputError(`Не найден пользователь с id: ${userId}`);
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Недопустимое id пользователя`;
  }
}

function CheckIsUserId() {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      validator: IsUserIdConstraint,
    });
  };
}

export function IsUserId() {
  return applyDecorators(
    IsNumber(),
    CheckIsUserId(),
  );
}