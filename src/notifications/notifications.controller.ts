import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { NotificationsService } from './notifications.service';
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { NotificationDto } from "./dto/notification.dto";
import { User } from "../users/entities/user.entity";
import { GetNotificationsResultDto } from "./dto/get-notifications-result.dto";

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('get-notifications')
  @UseGuards(JwtAuthGuard)
  async getNotifications(@CurrentUser() currUser: User): Promise<GetNotificationsResultDto> {
    return {
      notifications: await this.notificationsService.getNotifications(currUser.id),
      lastViewed: await this.notificationsService.getLastViewDate(currUser.id),
    };
  }

  @Get('get-all-notifications')
  async getAllNotifications() {
    return await this.notificationsService.getAllNotifications();
  }
}
