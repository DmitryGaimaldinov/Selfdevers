import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOperator, LessThan, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { IncorrectInputError } from "../errors/incorrect-input.error";
import { Following, FollowState } from "../followings/entities/following.entity";
import { UserCountersDto, UserDto } from "./dto/user.dto";
import { PhotosService } from "../photos/photos.service";
import { ImageDto } from "../photos/dtos/image.dto";
import { Note } from "../notes/entities/note.entity";
import { FollowStateDto } from "../followings/dto/follow-state.dto";
import { EntityNotFoundError } from "../errors/entity-not-found.error";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { FollowEvent } from "../followings/events/follow.event";

type FindUserType = Partial<Omit<User, 'notes' | 'repostedNotes'>>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Following) private followingRepo: Repository<Following>,
    // TODO: убрать NoteRepository, потому что модуль Note уже зависит
    // от модуляUser. А тут я костылями обхожу систему
    @InjectRepository(Note) private notesRepo: Repository<Note>,
    private photosService: PhotosService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    // Проверяем наличие пользователя. Есть ли уже такой email в базе данных.
    // Если есть, то выдаём ошибку
    await this.throwIfEmailNotUnique(createUserDto.email);

    // Хэшируем пароль
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;

    // Создаём пользователя в бд
    let user: User = this.userRepo.create({ ...createUserDto });
    const savedUser: User = await this.userRepo.save(user);

    // Генерируем начальный тег для пользователя и сохраняем
    const userTag = 'id' + savedUser.id;
    savedUser.userTag = userTag;
    user = await this.userRepo.save(user);

    return this.findOneBy({ id: savedUser.id }, savedUser.id);
  }

  private async throwIfEmailNotUnique(email: string) {
    const userByEmail = await this.findOneBy({ email }, null);
    if (userByEmail) {
      throw new IncorrectInputError('Этот email занят');
    }
  }

  async findOneBy(by: FindUserType, finderId: number | null): Promise<UserDto | null> {
    const user = await this.userRepo.findOneBy(by);

    if (!user) {
      return null;
    }

    // Convert ImageEntities to ImageDtos
    let avatarDto: ImageDto | null = null;
    if (user.avatar) {
      avatarDto = this.photosService.convertImageEntityToDto(user.avatar);
    }
    let backgroundDto: ImageDto | null = null;
    if (user.background) {
      backgroundDto = this.photosService.convertImageEntityToDto(user.background);
    }

    // get follow state
    let followStateDto: FollowStateDto = FollowStateDto.notFollowing;
    if (finderId) {
      followStateDto = await this.getFollowState(finderId, user.id);
    }

    return new UserDto({
      avatar: avatarDto,
      background: backgroundDto,
      counters: await this.getUserCountersDto(user.id),
      description: user.description,
      id: user.id,
      followState: followStateDto,
      isMe: user.id == finderId,
      isPrivate: user.isPrivate,
      name: user.name,
      registerDate: user.registerDate,
      userTag: user.userTag,
    });
  }

  private async getFollowState(followerId: number, followedId: number): Promise<FollowStateDto> {
    if (followerId == followedId) {
      return FollowStateDto.following;
    }

    const following = await this.followingRepo.findOne({
      where: {
        followerId,
        followedId,
      }
    });

    if (following) {
      if (following.followState == FollowState.requestSent) {
        return FollowStateDto.requestSent;
      } else if (following.followState == FollowState.following) {
        return FollowStateDto.following;
      }
    } else {
      return FollowStateDto.notFollowing;
    }
  }

  private async getUserCountersDto(userId: number): Promise<UserCountersDto> {
    const followersCount = await this.followingRepo.count({
      where: {
        followedId: userId,
        followState: FollowState.following,
      },
    });

    const followingsCount = await this.followingRepo.count({
      where: {
        followerId: userId,
        followState: FollowState.following,
      }
    });

    const notesCount = await this.notesRepo.count({
      where: {
        creator: {
          id: userId
        }
      }
    })

    return {
      followersCount,
      followingsCount,
      notesCount,
    };
  }

  // TODO: Сделать класс Paginated<>
  // async getFollowers(userId: number, beforeDate: Date) {
  //   const takeCount = 30;
  //
  //   let beforeDateCondition: FindOperator<Date> = undefined;
  //   if (beforeDate) {
  //     beforeDateCondition = LessThan(beforeDate);
  //   }
  //
  //   const followings = await this.followingRepo.find({
  //     where: {
  //       followedId: userId,
  //       date: beforeDateCondition,
  //     },
  //     order: {
  //       date: "DESC",
  //     },
  //     take: takeCount,
  //   });
  //
  //   const followers = await Promise.all(followings.map(async (following) => {
  //     return await this.findOneBy({ id: following.followerId })
  //   }));
  //
  //   if (followings.length < takeCount) {
  //     return {
  //       followers,
  //     }
  //   }
  //
  //   const oldestFollowing = followings[followings.length - 1];
  //   return {
  //     followers,
  //     'beforeDate': oldestFollowing.date,
  //   }
  // }

  // async getFollowedUsers(userId: number, beforeDate: Date) {
  //   const takeCount = 30;
  //
  //   let beforeDateCondition: FindOperator<Date> = undefined;
  //   if (beforeDate) {
  //     beforeDateCondition = LessThan(beforeDate);
  //   }
  //
  //   const followings = await this.followingRepo.find({
  //     where: {
  //       followerId: userId,
  //       date: beforeDateCondition,
  //     },
  //     order: {
  //       date: "DESC",
  //     },
  //     take: takeCount,
  //   });
  //
  //   const followedList = await Promise.all(followings.map(async (following) => {
  //     return await this.findOneBy({ id: following.followedId })
  //   }));
  //
  //   if (followedList.length < takeCount) {
  //     return {
  //       followedUsers: followedList,
  //     }
  //   }
  //
  //   const oldestFollowing = followings[followedList.length - 1];
  //   return {
  //     followedUsers: followedList,
  //     'beforeDate': oldestFollowing.date,
  //   }
  // }

  /**
   * Подписаться на пользователя или отправить ему запрос на подписку.
   * Возвращает пользователя, на которого был отправлен запрос.
   */
  async follow(follower: User, followedUserId: number): Promise<UserDto> {
    if (follower.id == followedUserId) {
      throw new IncorrectInputError('Нельзя подписаться на самого себя');
    }

    const followedUser: UserDto | null = await this.findOneBy({ id: followedUserId }, null);

    const isFollowingAccepted = !followedUser.isPrivate;

    const isAlreadyFollowed = await this.followingRepo.exist({
      where: {
        followedId: followedUserId,
        followerId: follower.id,
      }
    });
    if (!isAlreadyFollowed) {
      const following = this.followingRepo.create({
        followerId: follower.id,
        followedId: followedUser.id,
        followState: isFollowingAccepted ? FollowState.following : FollowState.requestSent,
      });
      await this.followingRepo.save(following);

      this.eventEmitter.emit(FollowEvent.eventName, new FollowEvent({
        followerId: follower.id,
        followedUserId,
        followingEntityId: following.id,
      }));
    }

    return await this.findOneBy({ id: followedUserId }, follower.id);
  }

  async unfollow(follower: User, followedUserId: number): Promise<UserDto> {
    await this.followingRepo.delete({ followerId: follower.id, followedId: followedUserId});

    return await this.findOneBy({ id: followedUserId }, follower.id);
  }



  // async getHasAccessToUserState(fromId: number, toId: number): Promise<HasAccessToUserState> {
  //   const followState = await this.getFollowState(fromId, toId);
  //
  //   const toUser = await this.findOneBy({ id: toId });
  //
  //   if (followState == FollowState.isMe) {
  //     return HasAccessToUserState.hasAccess;
  //   } else if (toUser.isPrivate) {
  //     return (followState === FollowState.following)
  //       ? HasAccessToUserState.hasAccess
  //       : HasAccessToUserState.profileIsPrivate;
  //   } else {
  //     // TODO: сделать учитывание черного списка
  //     return HasAccessToUserState.hasAccess;
  //   }
  // }

  // async findOneByTag(userTag: string): Promise<User | null> {
  //   userTag = this.makeTagFromString(userTag);
  //   return await this.userRepo.createQueryBuilder("user")
  //     .where("LOWER(user.userTag) = LOWER(:userTag)", { userTag })
  //     .getOne();
  // }

  // async setRefreshToken(userId: number, token: string) {
  //   await this.userRepo.update({ id: userId }, { refreshToken: token });
  // }

  // async setTag(userId: number, userTag: string) {
  //   // TODO: Возможно, это тоже нужно вынести отдельно в валидацию
  //   if (userTag.startsWith('id')) {
  //     throw new IncorrectInputError('Тэг пользователя не должен начинаться с id');
  //   }
  //
  //   userTag = this.makeTagFromString(userTag);
  //   await this.userRepo.update({ id: userId }, { userTag });
  // }
  //
  // async setName(userId: number, name: string) {
  //   await this.userRepo.update({ id: userId }, { name: name.trim() });
  // }
  //
  // async setDescription(userId: number, description: string) {
  //   await this.userRepo.update({ id: userId }, { description: description.trim() });
  // }

  // async updateAvatar(userId: number, avatar?: Express.Multer.File): Promise<ImageDto | null> {
  //   let image: ImageEntity = null;
  //   if (avatar) {
  //     image = await this.photosService.saveImage(avatar, { width: 1080, height: 1080 });
  //   }
  //
  //   const user = await this.findOneBy({ id: userId });
  //   user.avatar = image;
  //   await this.userRepo.save(user);
  //
  //   return {
  //     url: this.photosService.getUrlFromFilename(image.filename),
  //     blurhash: image.blurhash,
  //   };
  // }

  // async updateBackground(userId: number, background?: Express.Multer.File): Promise<ImageDto | null> {
  //   let image: ImageEntity = null;
  //   if (background) {
  //     image = await this.photosService.saveImage(background, { width: 1080, height: 1080 });
  //   }
  //
  //   const user = await this.findOneBy({ id: userId });
  //   user.background = image;
  //   await this.userRepo.save(user);
  //
  //   return {
  //     url: this.photosService.getUrlFromFilename(image.filename),
  //     blurhash: image.blurhash,
  //   };
  // }

  // async update(userId: number, userFields: Partial<User>): Promise<User> {
  //
  //   мб нужен будет throwIfTagNotUnique
  //
  //   await this.userRepo.update({ id: userId }, {
  //     ...userFields
  //   });

  //   return await this.findOneBy({ id: userId });
  // }

  // async changePrivacy(userId: number, isPrivate: boolean): Promise<boolean> {
  //   await this.userRepo.update({ id: userId }, { isPrivate });
  //   return isPrivate;
  // }

  // // TODO: Сделать работу с бд
  // async findOneById(id: number): Promise<User | undefined> {
  //   return this.users.find((user) => user.id === id);
  // }
  //
  // // TODO: Сделать работу с бд
  // async findOneByEmail(email: string): Promise<User | undefined> {
  //   return this.users.find((user) => user.email === email);
  // }
}

// export enum FollowState {
//   isMe = 'isMe',
//   notFollowing = 'notFollowing',
//   requestSent = 'requestSent',
//   following = 'following',
// }

// TODO: Добавить поле blacklisted
// export enum HasAccessToUserState {
//   hasAccess = 'hasAccess',
//   profileIsPrivate = 'profileIsPrivate',
// }
