import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { FollowingsModule } from "../followings/followings.module";
import { Following } from "../followings/entities/following.entity";
import { JwtModule } from "@nestjs/jwt";
import { ImageEntity } from "../photos/enitities/image.entity";
import { Note } from "../notes/entities/note.entity";
import { PhotosService } from "../photos/photos.service";
import { PhotosModule } from "../photos/photos.module";
import { IsUserIdConstraint } from "./decorators/is-user-id.decorator";

@Module({
  imports: [TypeOrmModule.forFeature([User, Note]), PhotosModule, FollowingsModule],
  controllers: [UsersController],
  providers: [UsersService, IsUserIdConstraint],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
