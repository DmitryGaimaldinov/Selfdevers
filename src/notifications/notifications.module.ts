import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationEntity } from "./entities/nofitication.entity";
import { UsersModule } from "../users/users.module";
import { NotificationsReadingEntity } from "./entities/notification-reading.entity";
import { NotificationsGateway } from "./notifications.gateway";
import { AuthService } from "../auth/auth.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity, NotificationsReadingEntity]), UsersModule, AuthModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsGateway]
})
export class NotificationsModule {}
