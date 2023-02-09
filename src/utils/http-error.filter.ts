import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpCode, HttpStatus,
  NotFoundException,
  UnprocessableEntityException
} from "@nestjs/common";
import { BaseError } from "../errors/base.error";
import { EntityNotFoundError } from "../errors/entity-not-found.error";
import { IncorrectInputError } from "../errors/incorrect-input.error";

@Catch(BaseError)
export class HttpErrorFilter implements ExceptionFilter {
  catch(error: BaseError, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    let statusCode: number;

    if (error instanceof EntityNotFoundError) {
      statusCode = HttpStatus.NOT_FOUND;
    }
    else if (error instanceof IncorrectInputError) {
      statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
    }
    else {
      throw error;
    }

    response
      .status(statusCode)
      .json({
        statusCode,
        message: error.message,
      });
  }
}