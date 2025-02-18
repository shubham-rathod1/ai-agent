import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    MessageBody,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  @WebSocketGateway({ cors: true })
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    private connectedClients = new Map<string, string>(); // userId -> socketId
  
    handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
      this.connectedClients.forEach((socketId, userId) => {
        if (socketId === client.id) this.connectedClients.delete(userId);
      });
    }
  
    @SubscribeMessage('registerUser')
    handleRegisterUser(client: Socket, userId: string) {
      this.connectedClients.set(userId, client.id);
      console.log(`User ${userId} registered with socket ${client.id}`);
    }
  
    sendToUser(userId: string, event: string, data: any) {
      const socketId = this.connectedClients.get(userId);
      if (socketId) {
        this.server.to(socketId).emit(event, data);
      }
    }
  }
  