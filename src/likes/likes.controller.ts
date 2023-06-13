import { Body, Controller, Delete, Post, UseGuards } from "@nestjs/common";
import { LikesService } from './likes.service';
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "../users/entities/user.entity";
import { LikeNoteDto } from "./dto/like-note.dto";
import { DeleteNoteLikeDto } from "./dto/delete-note-like.dto";

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('like-note')
  @UseGuards(JwtAuthGuard)
  async likeNote(@CurrentUser() user: User, @Body() likeNoteDto: LikeNoteDto) {
    return await this.likesService.likeNote({ userId: user.id , noteId: likeNoteDto.noteId});
  }

  @Delete('delete-note-like')
  @UseGuards(JwtAuthGuard)
  async deleteNoteLike(@CurrentUser() user: User, @Body() deleteNoteLikeDto: DeleteNoteLikeDto) {
    return await this.likesService.deleteLikeNote({ userId: user.id , noteId: deleteNoteLikeDto.noteId});
  }
}
