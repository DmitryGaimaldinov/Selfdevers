import { Injectable } from "@nestjs/common";
import { Note } from "./entities/note.entity";
import {
  ArrayContains,
  FindOperator,
  FindOptionsWhere,
  ILike,
  In,
  IsNull,
  Like,
  QueryBuilder,
  Repository
} from "typeorm";
import { CreateNoteDto } from "./dto/create-note.dto";
import { User } from "../users/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { PhotosService } from "../photos/photos.service";
import { ImageEntity } from "../photos/enitities/image.entity";
import { NoteDto } from "./dto/note.dto";
import { ImageDto } from "../photos/dtos/image.dto";
import { UsersService } from "../users/users.service";
import { UserDto } from "../users/dto/user.dto";
import { Following, FollowState } from "../followings/entities/following.entity";
import { LikesService } from "../likes/likes.service";
import { LikeEntity } from "../likes/entities/like.entity";

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private readonly noteRepository: Repository<Note>,
    @InjectRepository(ImageEntity) private readonly imageRepository: Repository<ImageEntity>,
    @InjectRepository(Following) private readonly followingRepository: Repository<Following>,
    private photosService: PhotosService,
    private usersService: UsersService,
    private likesService: LikesService,
  ) {}

  async getAllNotes() {
    return await this.noteRepository.find({
      relations: {
        imageEntities: true,
      }
    });
  }

  async findById({id, finderId} : {id: number, finderId: number | null}): Promise<NoteDto | null> {
    const note = await this.noteRepository.findOne(
      {
        where: { id },
        relations: {
          imageEntities: true,
        }
      },
    );

    if (!note) {
      return null;
    }

    return await this.convertEntityToDto(note, finderId);
  }

  private async convertEntitiesToDtos(notes: Note[], relatedToUserId: number | null): Promise<NoteDto[]> {
    return await Promise.all(notes.map((note) => this.convertEntityToDto(note, relatedToUserId)));
  }

  private async convertEntityToDto(note: Note, relatedToUserId: number | null): Promise<NoteDto> {
    let imageDtos: ImageDto[] = [];
    if (note.imageEntities) {
      imageDtos = note.imageEntities.map((entity) => this.photosService.convertImageEntityToDto(entity));
    }

    const creatorDto: UserDto = await this.usersService.findOneBy({ id: note.creator.id }, relatedToUserId);

    let isQuoted = false;
    if (relatedToUserId) {
      isQuoted = await this.noteRepository.exist({
        where: {
          id: note.id,
          quotedNoteId: note.id,
          creator: { id: relatedToUserId },
        }
      });
    }

    const likeCount = await this.likesService.getNoteLikesCount(note.id);
    const isLikedByMe = await this.likesService.isNoteLikedByUser({ userId: relatedToUserId, noteId: note.id });

    const quoteCount = await this.noteRepository.count({
      where: {
        quotedNoteId: note.id
      }
    });
    let quotedNoteDto: NoteDto | null = null;
    if (note.quotedNoteId) {
      quotedNoteDto = await this.findById({ id: note.quotedNoteId, finderId: relatedToUserId })
    }

    const commentCount = await this.getCommentCount(note.id);

    return new NoteDto(
      note.id,
      note.text,
      imageDtos,
      isQuoted,
      note.isEdited,
      creatorDto,
      note.creationDate,
      creatorDto.id == relatedToUserId,
      likeCount,
      isLikedByMe,
      quoteCount,
      quotedNoteDto,
      commentCount,
    );
  }

  /// @Returns created note
  async createNote({creator, createNoteDto}: { creator: User, createNoteDto: CreateNoteDto }): Promise<NoteDto> {
    let imageEntities: ImageEntity[] = [];
    if (createNoteDto.imageIds) {
      imageEntities = await Promise.all(createNoteDto.imageIds.map((id) => {
        return this.imageRepository.findOneBy( { id });
      }));
    }

    let note: Note = this.noteRepository.create({
      text: createNoteDto.text,
      parentId: createNoteDto.parentId,
      creator,
      imageEntities: imageEntities,
      quotedNoteId: createNoteDto.quotedNoteId,
    });

    note = await this.noteRepository.save(note);
    return await this.convertEntityToDto(note, creator.id);
  }

  async getFeedPeople(userId: number): Promise<NoteDto[]> {
    const findCreatorWhere: FindOptionsWhere<User>[] = [
      { id: userId }
    ];

    const followings = await this.followingRepository.find({
      where: {
        followState: FollowState.following,
        followerId: userId,
      }
    });
    if (followings.length != 0) {
      const followedUsersIds = followings.map((following) => following.followedId);
      findCreatorWhere.push( { id: In(followedUsersIds) } );
    }

    // Теперь нужно искать посты людей, на которых человек подписан
    const notes = await this.noteRepository.find({
      where: {
        creator: findCreatorWhere,
        parentId: IsNull(),
      },
      order: {
        creationDate: "DESC",
      }
    });

    return await this.convertEntitiesToDtos(notes, userId);
  }

  async getUserNotes(userTag: string, finderId: number | null): Promise<NoteDto[]> {
    const notes: Note[] = await this.noteRepository.find({
      where: {
        creator: { userTag },
        parentId: null,
      },
      order: {
        creationDate: 'DESC',
      }
    });

    return await this.convertEntitiesToDtos(notes, finderId);
  }

  async getComments(noteId: number, finderId: number | null): Promise<NoteDto[]> {
    const notes: Note[] = await this.noteRepository.find({
      where: {
        parentId: noteId,
      }
    });

    return await this.convertEntitiesToDtos(notes, finderId);
  }

  private async getCommentCount(noteId: number): Promise<number> {
    return await this.noteRepository.count({
      where: { parentId: noteId },
    });
  }

  async getLatestNotes({ searchString, finderId }: { searchString: string, finderId: number}): Promise<NoteDto[]> {
    const findNoteWhere: FindOptionsWhere<Note>[] = [];

    const notes = await this.noteRepository.find({
      where: {
        text: Like(`%${searchString}%`),
        parentId: null,
      },
      order: {
        creationDate: 'DESC'
      }
    });

    return await this.convertEntitiesToDtos(notes, finderId);
  }

  async getPopularNotes({ searchString, finderId }: { searchString: string, finderId: number}): Promise<NoteDto[]> {
    const findNoteWhere: FindOptionsWhere<Note>[] = [];

    let notes: Note[] = await this.noteRepository.createQueryBuilder("a")
      .select('a.id')
      .where("a.text like :searchString", { searchString:`%${searchString}%` })
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(c.id)', 'count')
          .from(LikeEntity, 'c')
          .where('c.note.id = a.id');
      }, 'count')
      .orderBy('count', 'DESC')
      .loadRelationCountAndMap('a.likeCount', 'a.likes')
      .getMany();

    if (notes) {
      notes = await Promise.all(notes.map((note) => this.noteRepository.findOneBy({ id: note.id, parentId: null })));
    }

    // const notes = await this.noteRepository.find({
    //   where: {
    //     text: ILike(`%${searchString}%`)
    //   },
    //   relations: {
    //     likes: true,
    //   },
    //   order: {
    //     likes: CountQueuingStrategy()
    //   }
    // });

    return await this.convertEntitiesToDtos(notes, finderId);
  }
}
