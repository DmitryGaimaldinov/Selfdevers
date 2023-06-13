import { Module } from "@nestjs/common";
import { PhotosService } from './photos.service';
import { UsersModule } from "../users/users.module";
import { PhotosController } from './photos.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { Following } from "../followings/entities/following.entity";
import { ImageEntity } from "./enitities/image.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity])],
  providers: [PhotosService],
  controllers: [PhotosController],
  exports: [PhotosService, TypeOrmModule]
})
export class PhotosModule {}
