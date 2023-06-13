import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Note } from "./entities/note.entity";
import { User } from "../users/entities/user.entity";
import { PhotosService } from "../photos/photos.service";
import { ImageEntity } from "../photos/enitities/image.entity";
import { UsersService } from "../users/users.service";
import { Following } from "../followings/entities/following.entity";
import { UsersModule } from "../users/users.module";
import { PhotosModule } from "../photos/photos.module";
import { IsNoteIdConstraint } from "./decorators/is-note-id.decorator";
import { IsImageIdsArrayConstraint } from "./decorators/is-image-ids-array";
import { FollowingsModule } from "../followings/followings.module";
import { LikesModule } from "../likes/likes.module";

@Module({
  imports: [TypeOrmModule.forFeature([Note, ImageEntity]), UsersModule, PhotosModule, FollowingsModule, LikesModule],
  controllers: [NotesController],
  providers: [NotesService, IsNoteIdConstraint, IsImageIdsArrayConstraint],
})
export class NotesModule {}
