import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const UserParam = createParamDecorator<unknown>(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);