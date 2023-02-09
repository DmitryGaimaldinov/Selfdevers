import { BaseError } from "./base.error";

export class EntityNotFoundError extends BaseError {
  constructor(message: string) {
    super(message);
  }
}