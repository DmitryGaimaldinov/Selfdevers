// import { CanActivate, ExecutionContext, Injectable, mixin, Scope } from "@nestjs/common";
// import { isString } from "@nestjs/common/utils/shared.utils";
// import { IncorrectInputError } from "../../errors/incorrect-input.error";
// import { UsersService } from "../users.service";
// import { transformUserTag } from "../transform-user-tag-pipe";
//
// export const HasAccessToUserGuard(userId: number) = (role: string) => {
//   class HasAccessToUserGuardMixin implements CanActivate {
//     constructor(
//       private usersService: UsersService,
//     ) {}
//
//     async canActivate(
//       context: ExecutionContext,
//     ): Promise<boolean> {
//
//       const request = context.switchToHttp().getRequest();
//       const currentUser = request.user;
//
//       const hasAccess = this.usersService.getHasAccessToUserState()
//
//       return true;
//     }
//   }
//
//   const guard = mixin(HasAccessToUserGuardMixin);
//   return guard;
// }