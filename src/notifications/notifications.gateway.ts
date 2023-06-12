import {
  ConnectedSocket, MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { UsersService } from "../users/users.service";
import { OnEvent } from "@nestjs/event-emitter";
import { Server, Socket } from "socket.io";
import { AuthService } from "../auth/auth.service";
import { NotificationsService } from "./notifications.service";
import { UseGuards } from "@nestjs/common";
import { WsApplyUserGuard } from "../auth/guards/ws-apply-user.guard";
import { User } from "../users/entities/user.entity";
import { NotificationsChangedEvent } from "./events/notifications-changed";
import { JwtService } from "@nestjs/jwt";
import { UpdateTokenDto } from "./dto/update-token.dto";

@WebSocketGateway({
  middlewares: []
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private notificationsService: NotificationsService,
    private jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;

  // private async updateSocketUserId(client: Socket): Promise<void> {
  //   let jwtToken = client.handshake.query.token;
  //   let userId: number | null = null;
  //   if (jwtToken) {
  //     jwtToken = jwtToken as string;
  //     userId = await this.authService.verifyToken(jwtToken);
  //   }
  //   client.data.userId = userId;
  // }

  async handleConnection(client: Socket) {
    await this.setUserToClient(client);
    console.log(`client.handshake.query: ${JSON.stringify(client.handshake.query)}`);
    console.log(`client.handshake.query.token: ${JSON.stringify(client.handshake.query)}`);
    console.log(`socket connected: ${client.id}`);

    console.log(`handle connection. client.data.user: ${JSON.stringify(client.data.user)}`);
    console.log(`handle connection. client.data.user.id: ${client.data?.user?.id}`);

    if (client.data.user) {
      await this.updateUnreadNotificationsCount({ userId: client.data.user.id });
    }
  }


  handleDisconnect(client: Socket) {
    // throw new Error("Method not implemented.");
    console.log(`socket disconnected: ${client.id}`);
  }

  @SubscribeMessage('get-unread-notifications-count')
  @UseGuards(WsApplyUserGuard)
  async getNotificationsCount(@ConnectedSocket() client: Socket): Promise<number> {
    const user: User | null = client.data.user;
    if (user) {
      return await this.notificationsService.getUnreadNotificationsCount(user.id);
    } else {
      this.emitUnauthorized(client);
    }
  }

  @SubscribeMessage('update-token')
  async updateUserToken(@ConnectedSocket() client: Socket, @MessageBody() tokenBody: UpdateTokenDto) {
    client.handshake.query.token = tokenBody.token;
    await this.setUserToClient(client);
    if (client.data.user) {
      await this.updateUnreadNotificationsCount({ userId: client.data.user.id });
    }
  }

  @OnEvent(NotificationsChangedEvent.eventName)
  async updateUnreadNotificationsCount({ userId } : NotificationsChangedEvent) {
    const unreadNotificationsCount = await this.notificationsService.getUnreadNotificationsCount(userId);
    console.log(`unreadNotificationsCount: ${unreadNotificationsCount}`);

    const clients = await this.server.fetchSockets();
    for (const client of clients) {
      console.log(`client.data?.user?.id: ${client.data?.user?.id}. userId: ${userId}`);
      if (client.data?.user?.id == userId) {
        console.log('unread-notifications-count-changed', unreadNotificationsCount);
        client.emit('unread-notifications-count-changed', unreadNotificationsCount);
      }
    }
  }

  private async setUserToClient(client: Socket): Promise<void> {
    const token = client.handshake.query.token;
    await this.setUserToClientFromToken(client, token as (string | null));
  }

  private async setUserToClientFromToken(client: Socket, token: string | null) {
    let user: User | null = null;

    console.log(`setUserToClientFromToken. token: ${token}`);
    if (token) {
      try {
        const verifiedToken = this.jwtService.verify(token as string);
        user = await this.authService.validateUserJwt(verifiedToken['sub']);
      } catch (ex) {
        // this.emitUnauthorized(client);
        // TODO: делать throw WsError
      }
    }

    client.data.user = user;
  }

  private emitUnauthorized(client: Socket) {
    client.emit('unauthorized');
  }
}