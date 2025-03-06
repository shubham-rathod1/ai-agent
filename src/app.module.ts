import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AgentModule } from './agent/agent.module';
import { UploadModule } from './upload/upload.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
// import { SubscriptionModule } from './subscription/subscription.module';
// import { ApiKeyModule } from './apis/apis.module';
import { ChatSessionModule } from './chat-session/chat-session.module';
import { ChatMessageModule } from './chat-message/chat-message.module';
import { BullModule } from '@nestjs/bullmq';
import { GrpMessageModule } from './grp-message/grp-message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: '.env.local',
      envFilePath: '.env.prod',
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          username: configService.get('REDIS_USERNAME'),
          password: configService.get('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const options = {
          type: 'postgres',
          host: configService.get<string>('PG_HOST'),
          port: configService.get<number>('PG_PORT'),
          username: configService.get<string>('PG_USER'),
          password: configService.get<string>('PG_PASSWORD'),
          database: configService.get<string>('PG_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        } as TypeOrmModuleAsyncOptions;
        return options;
      },
      inject: [ConfigService],
    }),
    AgentModule,
    UploadModule,
    AuthModule,
    UsersModule,
    // SubscriptionModule,
    // ApiKeyModule,
    ChatSessionModule,
    ChatMessageModule,
    // GrpMessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
