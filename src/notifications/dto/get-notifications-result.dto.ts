import { NotificationDto } from "./notification.dto";

export class GetNotificationsResultDto {
  lastViewed: Date | null;
  notifications: NotificationDto[];
}