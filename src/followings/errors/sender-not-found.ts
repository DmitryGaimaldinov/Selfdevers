import { BaseError } from "../../errors/base.error";

export class SenderNotFoundError extends BaseError {
  constructor() {
    super('Отправитель запроса не найден');
  }
}