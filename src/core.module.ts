import { JwtModule } from "@nestjs/jwt";
import { Global, Module } from "@nestjs/common";
import { jwtConstants } from "./auth/constants";

@Global()
@Module({
  imports: [
    JwtModule.register({
      // TODO: Поменять на ENV переменные
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },

    }),
  ],
  exports: [JwtModule]
})
export class CoreModule {}