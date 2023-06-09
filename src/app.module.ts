import { BadRequestException, MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotesModule } from './notes/notes.module';
import { FollowingsModule } from './followings/followings.module';
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage, memoryStorage } from "multer";
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PhotosModule } from './photos/photos.module';
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./auth/constants";
import { CoreModule } from "./core.module";
import { NotificationsModule } from './notifications/notifications.module';
import { EventEmitterModule } from "@nestjs/event-emitter";

@Module({
  imports: [
    UsersModule,
    AuthModule,
    NotesModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: '../db',
      entities: ['dist/**/*.entity.js'],
      synchronize: true,
      logging: true,
      autoLoadEntities: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FollowingsModule,
    MulterModule.register({
      dest: './files',
      storage: memoryStorage(),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'files'),
    }),
    PhotosModule,
    CoreModule,
    NotificationsModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}