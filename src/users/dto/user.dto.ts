import { User } from "../entities/user.entity";
import { ImageDto } from "../../photos/dtos/image.dto";
import { FollowStateDto } from "../../followings/dto/follow-state.dto";

export class UserDto {
  id: number;

  name: string;

  userTag: string;

  description: string;

  registerDate: Date;

  avatar?: ImageDto;

  background?: ImageDto;

  isPrivate: boolean;

  counters: UserCountersDto;

  isMe: boolean;

  followState: FollowStateDto;

  constructor(data: {
    id: number
    name: string,
    userTag: string,
    description: string,
    registerDate: Date,
    avatar: ImageDto,
    background: ImageDto,
    isPrivate: boolean,
    counters: UserCountersDto,
    isMe: boolean,
    followState: FollowStateDto,
  }) {
    this.id = data.id;
    this.name = data.name;
    this.userTag = data.userTag;
    this.description = data.description;
    this.registerDate = data.registerDate;
    this.avatar = data.avatar;
    this.background = data.background;
    this.isPrivate = data.isPrivate;
    this.counters = data.counters;
    this.isMe = data.isMe;
    this.followState = data.followState;
  }
}

export class UserCountersDto {
  followersCount: number;
  followingsCount: number;
  notesCount: number;
}

