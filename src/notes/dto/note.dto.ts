import { ImageDto } from "../../photos/dtos/image.dto";
import { UserDto } from "../../users/dto/user.dto";

export class NoteDto {
  constructor(id: number,
              text: string,
              images: ImageDto[],
              isRepostedOrQuoted: boolean,
              canBeReposted: boolean,
              isEdited: boolean,
              creator: UserDto,
              creationDate: Date,
              isMyNote: boolean,
  ) {
    this.id = id;
    this.text = text;
    this.images = images;
    this.isRepostedOrQuoted = isRepostedOrQuoted;
    this.canBeReposted = canBeReposted;
    this.isEdited = isEdited;
    this.creator = creator;
    this.creationDate = creationDate;
    this.isMyNote = isMyNote;
  }

  id: number;

  text: string;

  images: ImageDto[];

  isRepostedOrQuoted: boolean;

  canBeReposted: boolean;

  isEdited: boolean;

  creator: UserDto;

  creationDate: Date;

  isMyNote: boolean;
}