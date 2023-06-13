import { Injectable } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { FollowEvent } from "../followings/events/follow.event";
import { InjectRepository } from "@nestjs/typeorm";
import { ArrayContains, In, MoreThan, Repository } from "typeorm";
import { NotificationEntity } from "./entities/nofitication.entity";
import { NotificationType, ParentType } from "./entities/notification-enums";
import { NotificationContentDto, NotificationDto } from "./dto/notification.dto";
import { FollowNotificationContentDto } from "./dto/follow-notification-content.dto";
import { UsersService } from "../users/users.service";
import { NotificationsReadingEntity } from "./entities/notification-reading.entity";
import { NotificationsChangedEvent } from "./events/notifications-changed";
import { use } from "passport";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity) private notificationsRepo: Repository<NotificationEntity>,
    @InjectRepository(NotificationsReadingEntity) private notificationsReadingRepo: Repository<NotificationsReadingEntity>,
    private usersService: UsersService,
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent(FollowEvent.eventName)
  async onFollowEvent(event: FollowEvent) {
    const notification: NotificationEntity = this.notificationsRepo.create({
      notificationType: NotificationType.follow,
      feedbackId: event.followerId,
      parentType: ParentType.user,
      parentId: null,
      recipients: [ { id: event.followedUserId }],
    });
    await this.notificationsRepo.save(notification);
    await this._userNotificationsChanged(event.followedUserId);
  }

  async _userNotificationsChanged(userId: number) {
    this.eventEmitter.emit(
      NotificationsChangedEvent.eventName,
      new NotificationsChangedEvent({
        userId,
      })
    );
  }

  async getUnreadNotificationsCount(userId: number): Promise<number> {
    const lastViewDate: Date | null = await this.getLastViewDate(userId);

    return await this.notificationsRepo.count({
      where: {
        recipients: {
          id: userId,
        }
      },
      relations: {
        recipients: true,
      }
    });

    if (lastViewDate) {
      return await this.notificationsRepo.count({
        where: {
          recipients: ArrayContains([ { userId }]),
          creationDate: MoreThan(lastViewDate),
        },
        relations: {
          recipients: true
        }
      });
    } else {
      return await this.notificationsRepo.count({
        where: {
          recipients: ArrayContains([userId]),
        },
      });
    }
  }

  private async convertEntityToDto(entity: NotificationEntity, currUserId: number | null): Promise<NotificationDto> {
    let content: NotificationContentDto;
    switch (entity.notificationType) {
      case NotificationType.follow:
        const follower = await this.usersService.findOneBy({ id: entity.feedbackId }, currUserId);
        content = new FollowNotificationContentDto({
            follower,
            notificationType: entity.notificationType });
        break;
      case NotificationType.followRequest:
        break;
    }

    return new NotificationDto({
      id: entity.id,
      content,
      date: entity.creationDate,
    });
  }

  async getNotifications(userId: number): Promise<NotificationDto[]> {
    const notifications: NotificationEntity[] = await this.notificationsRepo.find({
      where: {
        recipients: {
          id: userId,
        }
      }
    });

    if (notifications) {
      return Promise.all(notifications.map((entity) => this.convertEntityToDto(entity, userId)));
    } else {
      return [];
    }
  }

  async getLastViewDate(userId: number): Promise<Date | null> {
    const reading = await this.notificationsReadingRepo.findOneBy({ userId });
    if (reading) {
      return reading.lastViewed;
    }

    return null;
  }

  // async markAsViewed() {
  //
  // }

  // TODO: Удалить позже
  async getAllNotifications() {
    return await this.notificationsRepo.find({
      relations: {
        recipients: true,
      }
    });
  }
}
