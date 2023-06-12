import { IsNoteId } from "../../notes/decorators/is-note-id.decorator";

export class DeleteNoteLikeDto {
  @IsNoteId()
  noteId: number;
}