import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from "../users/users.service";
import { IncorrectInputError } from "../errors/incorrect-input.error";

@ValidatorConstraint({ name: 'IsValidUserTag', async: true })
@Injectable()
export class IsValidUserTagConstraint implements ValidatorConstraintInterface {
  constructor(private usersService: UsersService) {}

  async validate(userTag: string, args: ValidationArguments): Promise<boolean> {
    if (!userTag) return false;

    if (userTag.length < 3 || userTag.length > 20) {
      throw new IncorrectInputError('Длина тега должна быть от 3 до 20 символов');
    }

    if (userTag.startsWith('id')) {
      throw new IncorrectInputError('Тэг пользователя не должен начинаться с приставки id');
    }

    if(!/^[a-z0-9_]+$/.test(userTag)) {
      throw new IncorrectInputError('Тэг пользователя должен содержать только английские символы и цифры');
    }

    const user = await this.usersService.findOneByTag(userTag);

    if (user) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Извините, этот тег уже используется`;
  }
}

export function IsValidUserTag() {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      validator: IsValidUserTagConstraint,
    });
  };
}