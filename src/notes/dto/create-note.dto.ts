import { IsOptional, IsString, MaxLength } from "class-validator";
import { IsNoteId } from "../decorators/is-note-id.decorator";
import { IsImageIdsArray } from "../decorators/is-image-ids-array";

export class CreateNoteDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  text: string;

  @IsOptional()
  @IsNoteId()
  parentId: number;

  @IsOptional()
  @IsNoteId()
  quotedNoteId: number;

  @IsOptional()
  @IsImageIdsArray()
  imageIds: number[];
}
