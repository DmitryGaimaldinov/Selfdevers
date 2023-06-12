import { IsNoteId } from "../../notes/decorators/is-note-id.decorator";

export class LikeNoteDto {
  @IsNoteId()
  noteId: number;
}