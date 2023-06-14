import {
  Body,
  Controller,
  Get,
  Post,
  UnprocessableEntityException,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { NotesService } from './notes.service';
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateNoteDto } from "./dto/create-note.dto";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FileFieldsInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { imageFileFilter } from "../utils/image-file-filter";
import { GetFeedPeopleResultDto } from "./dto/get-feed-people-result.dto";
import { ApplyUserGuard } from "../auth/guards/apply-user.guard";
import { User } from "../users/entities/user.entity";
import { GetUserNotesDto } from "./dto/get-user-notes.dto";
import { NoteDto } from "./dto/note.dto";
import { GetNoteByIdDto } from "./dto/get-note-by-id.dto";
import { GetUserNotesResultDto } from "./dto/get-user-notes-result.dto";
import { GetCommentsDto } from "./dto/get-comments.dto";
import { GetCommentsResultDto } from "./dto/get-comments-result.dto";

@ApiTags('notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get('get-all-notes')
  async getAllNotes() {
    return await this.notesService.getAllNotes();
  }

  @Post('create-note')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'images', maxCount: 4 },
  ],
    { fileFilter: imageFileFilter }
  ))
  async createNote(
    @CurrentUser() currUser,
    @Body() createNoteDto: CreateNoteDto,
  ): Promise<NoteDto> {
    if (createNoteDto.text.length == 0 && createNoteDto.imageIds.length == 0) {
      throw new UnprocessableEntityException('Нельзя опубликовать пустой пост');
    }
    return await this.notesService.createNote({
      creator: currUser,
      createNoteDto,
    });
  }

  @Post('get-feed-people')
  @UseGuards(JwtAuthGuard)
  async getFeedPeople(@CurrentUser() currUser: User): Promise<GetFeedPeopleResultDto> {
    console.log(`currUser.id: ${currUser.id}`);
    return {
      notes: await this.notesService.getFeedPeople(currUser.id)
    };
  }

  @Post('get-user-notes')
  @UseGuards(ApplyUserGuard)
  async getUserNotes(@CurrentUser() currUser: User | null, @Body() dto: GetUserNotesDto): Promise<GetUserNotesResultDto> {
    return {
      notes: await this.notesService.getUserNotes(dto.userTag, currUser?.id)
    };
  }

  @Post('get-note-by-id')
  @UseGuards(ApplyUserGuard)
  async getNoteById(@CurrentUser() currUser: User | null, @Body() dto: GetNoteByIdDto): Promise<NoteDto> {
    return await this.notesService.findById({ id: dto.noteId, finderId: currUser?.id });
  }

  @Post('get-comments')
  @UseGuards(ApplyUserGuard)
  async getComments(@CurrentUser() currUser: User | null, @Body() dto: GetCommentsDto): Promise<GetCommentsResultDto> {
    return {
      comments: await this.notesService.getComments(dto.noteId, currUser?.id)
    };
  }

  @Post('get-latest-notes')
  @UseGuards(ApplyUserGuard)
  async getLatestNotes(@Body() { text }: { text: string }, @CurrentUser() currUser: User | null) {
    return {
      notes: await this.notesService.getLatestNotes({ searchString: text, finderId: currUser?.id })
    };
  }

  @Post('get-popular-notes')
  @UseGuards(ApplyUserGuard)
  async getPopularNotes(@Body() { text }: { text: string }, @CurrentUser() currUser: User | null) {
    return {
      notes: await this.notesService.getPopularNotes({ searchString: text, finderId: currUser?.id })
    };
  }
}
