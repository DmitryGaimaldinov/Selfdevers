import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { FollowingsService } from './followings.service';
import { FollowDto } from "./dto/follow.dto";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "../users/entities/user.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { GetFollowersCountDto } from "./dto/get-followers-count.dto";
import { UnfollowDto } from "./dto/unfollow.dto";

@Controller('followings')
export class FollowingsController {
  constructor(private readonly followingsService: FollowingsService) {}
  //
  // @UseGuards(JwtAuthGuard)
  // @Post('unfollow')
  // async unfollow(@CurrentUser() user: User, @Body() followDto: UnfollowDto) {
  //   // TODO: Здесь должно что-то возвращаться
  //   return await this.followingsService.unfollow(user.id, followDto.followedUserId);
  // }


  // TODO: сделать принятие подписки
  // @Get('follower-count')
  // async getFollowersCount(@CurrentUser() user: User, @Body() getCountDto: GetFollowersCountDto) {
  //   return this.followingsService.getFollowerCount(getCountDto.userId);
  // }
  //
  //
  // // TODO: потом убрать этот метод
  // @Get('all-followings')
  // async getAllFollowings() {
  //   return await this.followingsService.getAllFollowings();
  // }
}
