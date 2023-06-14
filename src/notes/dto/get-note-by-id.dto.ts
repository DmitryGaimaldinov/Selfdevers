import { IsNoteId } from "../decorators/is-note-id.decorator";

export class GetNoteByIdDto {

  @IsNoteId()
  noteId: number;
}