import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import * as dotenv from 'dotenv';

dotenv.config();

const WS_PORT =
  typeof process.env.WS_PORT === 'string' ? +process.env.WS_PORT : 8001;

@WebSocketGateway(WS_PORT, { cors: '*:*' })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;
  afterInit(server: Server) {
    this.logger.log(`Initialized ${server}`);
    this.logger.log(`Socket PORT: ${WS_PORT}`);
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected:  ${client}`);
  }
  handleConnection(client: Socket) {
    this.logger.log(`Client has connected:  ${client}`);
  }
  private logger: Logger = new Logger('App Gateway');

  @SubscribeMessage('message')
  handleMessage(client: Socket, text: string): void {
    this.wss.emit('message', text);
  }
}
