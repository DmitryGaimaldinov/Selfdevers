import { applyDecorators } from "@nestjs/common";
import { IsString, MaxLength, MinLength } from "class-validator";
import { RemoveLineBreaks } from "../../utils/decorators/remove-line-breaks.decorator";

export function UserDescriptionValidator() {
  return applyDecorators(
    IsString(),
    MaxLength(140),
    RemoveLineBreaks(),
  );
}