import { BadRequestException, MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostsModule } from './posts/posts.module';
import { FollowingsModule } from './followings/followings.module';
import { IsValidUserTagConstraint } from "./decorators/validate-tag.decorator";

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PostsModule,
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
  ],
  controllers: [AppController],
  providers: [AppService, IsValidUserTagConstraint,],
})
export class AppModule {}