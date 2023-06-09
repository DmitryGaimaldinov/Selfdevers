import { applyDecorators } from "@nestjs/common";
import { Transform } from "class-transformer";

export function RemoveLineBreaks() {
  return applyDecorators(
    Transform(( { value } ) => value.replace(/(\r\n|\n|\r)/gm, "")),
  );
}
