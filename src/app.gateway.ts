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

@WebSocketGateway(8001, { cors: '*:*' })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;
  afterInit(server: Server) {
    this.logger.log(`Initialized ${server}`);
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
