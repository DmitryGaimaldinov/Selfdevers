import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
  UnprocessableEntityException
} from "@nestjs/common";
import { catchError, Observable } from "rxjs";
import { EntityNotFoundError } from "../errors/entity-not-found.error";
import { IncorrectInputError } from "../errors/incorrect-input.error";

@Injectable()
export class BaseErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(catchError(error => {
        if (error instanceof EntityNotFoundError) {
          throw new NotFoundException(error.message);
        } else if (error instanceof IncorrectInputError) {
          throw new UnprocessableEntityException(error.message);
        } else {
          throw error;
        }
      }));
  }
}