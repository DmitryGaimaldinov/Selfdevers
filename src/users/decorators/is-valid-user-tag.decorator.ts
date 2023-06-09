// import {
//   registerDecorator,
//   ValidationArguments,
//   ValidatorConstraint,
//   ValidatorConstraintInterface
// } from "class-validator";
// import { UsersService } from "../users.service";
// import { IncorrectInputError } from "../../errors/incorrect-input.error";
// import { Inject, Injectable, Scope } from "@nestjs/common";
// import { isString } from "@nestjs/common/utils/shared.utils";
// import { REQUEST } from "@nestjs/core";
// import { Request } from "express";
//
// @ValidatorConstraint({ name: 'IsValidUserTag', async: true })
// @Injectable()
// export class IsValidUserTagConstraint implements ValidatorConstraintInterface {
//   constructor(
//     private usersService: UsersService,
//   ) {}
//
//   async validate(userTag: string, args: ValidationArguments): Promise<boolean> {
//     if (!isString(userTag)) {
//       throw new IncorrectInputError('Тэг должен быть строкой');
//     }
//
//     if (userTag.length < 3 || userTag.length > 20) {
//       throw new IncorrectInputError('Длина тега должна быть от 3 до 20 символов');
//     }
//
//     if(!/^[a-z0-9_]+$/.test(userTag)) {
//       throw new IncorrectInputError('Тэг пользователя может содержать только английские символы, цифры и подчёркивания');
//     }
//
//     // TODO: Пользователь может захотеть установить тот же тег, что у него уже используется.
//     // Нужно сделать именно через UserTagGuard
//
//     const user = await this.usersService.findOneByTag(userTag);
//     if (user) {
//       // TODO: Выдавать ошибку о том, что данный тег занят
//       throw new IncorrectInputError('Извините, данный тег занят');
//     }
//
//     return true;
//   }
//
//   defaultMessage(args: ValidationArguments) {
//     return `Недопустимый тэг`;
//   }
// }
//
// export function IsValidUserTag() {
//   return function (object: any, propertyName: string) {
//     registerDecorator({
//       target: object.constructor,
//       propertyName: propertyName,
//       validator: IsValidUserTagConstraint,
//     });
//   };
// }