import { ImageDto } from "../../photos/dtos/image.dto";
import { UserDto } from "../../users/dto/user.dto";

export class NoteDto {
  constructor(id: number,
              text: string,
              images: ImageDto[],
              isQuoted: boolean,
              isEdited: boolean,
              creator: UserDto,
              creationDate: Date,
              isMyNote: boolean,
              likeCount: number,
              isLikedByMe: boolean,
              quoteCount: number,
              quotedNoteDto: NoteDto | null,
  ) {
    this.id = id;
    this.text = text;
    this.images = images;
    this.isQuoted = isQuoted;
    this.isEdited = isEdited;
    this.creator = creator;
    this.creationDate = creationDate;
    this.isMyNote = isMyNote;
    this.likeCount = likeCount;
    this.isLikedByMe = isLikedByMe;
    this.quoteCount = quoteCount;
    this.quotedNoteDto = quotedNoteDto;
  }

  id: number;

  text: string;

  images: ImageDto[];

  isQuoted: boolean;

  isEdited: boolean;

  creator: UserDto;

  creationDate: Date;

  isMyNote: boolean;

  likeCount: number;

  isLikedByMe: boolean;

  quoteCount: number;

  quotedNoteDto: NoteDto | null;
}