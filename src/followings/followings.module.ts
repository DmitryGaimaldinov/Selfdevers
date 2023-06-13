import { Module } from '@nestjs/common';
import { FollowingsService } from './followings.service';
import { FollowingsController } from './followings.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Following } from "./entities/following.entity";
import { UsersModule } from "../users/users.module";
import { User } from "../users/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Following])],
  controllers: [FollowingsController],
  providers: [FollowingsService],
  exports: [FollowingsService, TypeOrmModule],
})
export class FollowingsModule {}
