import { BaseError } from "./base.error";

export class IncorrectInputError extends BaseError {
  constructor(message: string) {
    super(message);
  }
}