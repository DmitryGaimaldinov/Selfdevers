import { IsNoteId } from "../decorators/is-note-id.decorator";

export class GetCommentsDto {
  @IsNoteId()
  noteId: number;
}