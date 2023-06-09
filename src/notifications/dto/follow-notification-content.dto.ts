import { UserDto } from "../../users/dto/user.dto";
import { NotificationContentDto } from "./notification.dto";
import { NotificationType } from "../entities/notification-enums";

export class FollowNotificationContentDto extends NotificationContentDto {
  follower: UserDto;

  constructor({ follower, notificationType } : { follower: UserDto, notificationType: NotificationType }) {
    super(notificationType);
    this.follower = follower;
  }
}