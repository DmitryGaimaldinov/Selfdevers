import {
  Body,
  Controller,
  Get,
  Headers, MethodNotAllowedException,
  NotFoundException,
  Post,
  Req,
  UnauthorizedException, UploadedFile,
  UseGuards, UseInterceptors
} from "@nestjs/common";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { HttpAdapterHost } from "@nestjs/core";
import { UserTagGuard } from "./guards/user-tag.guard";
import { GetUserDto } from "./dto/get-user-dto";
import { JwtService } from "@nestjs/jwt";
import { GetFollowersDto } from "./dto/get-followers.dto";
import { GetFollowingsDto } from "./dto/get-followings.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { imageFileFilter } from "../utils/image-file-filter";
import { ImageDto } from "../photos/dtos/image.dto";
import { PhotosService } from "../photos/photos.service";
import { UserDto } from "./dto/user.dto";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { FollowDto } from "../followings/dto/follow.dto";
import { ApplyUserGuard } from "../auth/guards/apply-user.guard";
import { GetFollowersResultDto } from "./dto/get-followers-result.dto";
import { GetFollowingsResultDto } from "./dto/get-followings-result.dto";

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private adapterHost: HttpAdapterHost,
    private jwtService: JwtService,
    private photosService: PhotosService,
  ) {}

  // TODO: Сделать декоратор @CurrentUserOrNull()
  @Post('get-user')
  @UseGuards(ApplyUserGuard)
  async getUser(@Body() getUserDto: GetUserDto, @CurrentUser() currUser: User | null): Promise<UserDto> {
    console.log(`currentUser: ${currUser}`);

    const tag = getUserDto.userTag;
    let userDto: UserDto;

    if (tag.startsWith('id')) {
      const idFromTag = +tag.substring(2);
      if (Number.isNaN(idFromTag)) {
        throw new NotFoundException('Пользователь не найден');
      }

      userDto = await this.usersService.findOneBy({ id: idFromTag }, currUser?.id);
    } else {
      userDto = await this.usersService.findOneBy({ userTag: tag }, currUser?.id);
    }

    if (userDto) {
      return userDto;
    }
    throw new NotFoundException('Пользователь не найден');
  }

  /**
   * Начать читать кого-то. Если "кто-то" имеет приватный профиль,
   * то отправить запрос на подписку.
   */
  @UseGuards(JwtAuthGuard)
  @Post('follow')
  async follow(@CurrentUser() user: User, @Body() followDto: FollowDto): Promise<UserDto> {
    return await this.usersService.follow(user, followDto.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('unfollow')
  async unfollow(@CurrentUser() user: User, @Body() followDto: FollowDto): Promise<UserDto> {
    return await this.usersService.unfollow(user, followDto.userId);
  }

  @Post('update-profile')
  @UseGuards(JwtAuthGuard, UserTagGuard)
  async updateProfile(@CurrentUser() currentUser: UserDto, @Body() updateProfileDto: UpdateProfileDto): Promise<UserDto> {
    return this.usersService.update(currentUser.id, { ...updateProfileDto });
  }

  @Post('get-followers')
  @UseGuards(ApplyUserGuard)
  async getFollowers(@CurrentUser() currUser: UserDto | null, @Body() getFollowersDto: GetFollowersDto): Promise<GetFollowersResultDto> {
    return {
      followers: await this.usersService.getFollowers(getFollowersDto.userId, currUser?.id)
    };
  }

  @Post('get-followings')
  @UseGuards(ApplyUserGuard)
  async getFollowings(@CurrentUser() currUser: UserDto | null, @Body() getFollowingsDto: GetFollowingsDto): Promise<GetFollowingsResultDto> {
    return {
      followings: await this.usersService.getFollowings(getFollowingsDto.userId, currUser?.id)
    };
  }

  @Post('update-avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor(
    'file',
    { fileFilter: imageFileFilter }
  ))
  async updateAvatar(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() currUser: UserDto,
  ): Promise<ImageDto | null> {
    return await this.usersService.updateAvatar(currUser.id, file);
  }

  @Post('update-background')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor(
    'file',
    { fileFilter: imageFileFilter }
  ))
  async updateBackground(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() currUser: UserDto,
  ): Promise<ImageDto | null> {
    return await this.usersService.updateBackground(currUser.id, file);
  }

  @Post('remove-avatar')
  @UseGuards(JwtAuthGuard)
  async removeAvatar(@CurrentUser() currUser: UserDto) {
    await this.usersService.updateAvatar(currUser.id, null);
  }

  @Post('remove-background')
  @UseGuards(JwtAuthGuard)
  async removeBackground(@CurrentUser() currUser: UserDto) {
    await this.usersService.updateBackground(currUser.id, null);
  }
}