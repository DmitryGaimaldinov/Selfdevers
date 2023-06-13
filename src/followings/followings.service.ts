import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Following } from "./entities/following.entity";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { EntityNotFoundError } from "../errors/entity-not-found.error";
import { IncorrectInputError } from "../errors/incorrect-input.error";
import { User } from "../users/entities/user.entity";

@Injectable()
export class FollowingsService {
  constructor(
    @InjectRepository(Following) private followingRepo: Repository<Following>,
    // private usersService: UsersService,
  ) {}


  //
  // async unfollow(followerId: number, followedId: number) {
  //   await this.followingRepo.delete({
  //     followerId,
  //     followedId,
  //   });
  //
  //   return await this.getFollowersCount(followedId);
  // }
  //
  // async getFollowersCount(followedId: number) {
  //   const followedUser = await this.usersService.findOneBy({ id: followedId }, [ 'counters' ]);
  //   return followedUser.counters.get(UserCounterType.followers);
  // }

  // async getFollowerCount(userId: number) {
  //   return await this.followingRepo.count({
  //     relations: {
  //       followed: true
  //     },
  //     where: {
  //       followed: { id: userId }
  //     }
  //   });
  //
  //
  //   // return await this.followingRepo.countBy({ followedId: userId });
  // }
  //
  // async updateAccepting(followingId: number, isAccepted: boolean) {
  //   await this.followingRepo.update({ id: followingId }, { isAccepted });
  // }
}
