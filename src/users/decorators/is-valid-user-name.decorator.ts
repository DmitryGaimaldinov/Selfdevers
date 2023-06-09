import { applyDecorators } from '@nestjs/common';
import { IsString, MaxLength, MinLength } from "class-validator";
import { Transform } from "class-transformer";
import { RemoveLineBreaks } from "../../utils/decorators/remove-line-breaks.decorator";

export function UserNameValidator() {
  return applyDecorators(
    IsString(),
    MinLength(1),
    MaxLength(20),
    RemoveLineBreaks(),
  );
}