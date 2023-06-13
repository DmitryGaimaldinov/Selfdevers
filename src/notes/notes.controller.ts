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
  ): Promise<number> {
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
  async getUserNotes(@CurrentUser() currUser: User | null, @Body() dto: GetUserNotesDto): Promise<NoteDto[]> {
    return await this.notesService.getUserNotes(dto.userId);
  }
}
