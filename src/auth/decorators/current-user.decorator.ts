import { createParamDecorator, ExecutionContext, Injectable } from "@nestjs/common";
import { User } from "../../users/entities/user.entity";

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest().user;
    if (!user) {
      return null;
    }

    return user;
  },
);