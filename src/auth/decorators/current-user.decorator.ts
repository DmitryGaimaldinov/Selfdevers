import { createParamDecorator, ExecutionContext, Injectable } from "@nestjs/common";
import { User } from "../../users/entities/user.entity";

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log(`request: ${JSON.stringify(request.body)}`);
    return request.user;
  },
);