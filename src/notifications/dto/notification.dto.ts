import { NotificationType } from "../entities/notification-enums";

export class NotificationDto {
  id: number;
  content: NotificationContentDto;
  date: Date;

  constructor( { id, content, date } : {
    id: number,
    content: NotificationContentDto,
    date: Date
  }) {
    this.id = id;
    this.content = content;
    this.date = date;
  }
}

export abstract class NotificationContentDto {
  notificationType: NotificationType;
  protected constructor(notificationType: NotificationType) {
    this.notificationType = notificationType;
  }
}