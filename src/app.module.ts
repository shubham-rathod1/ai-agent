import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AgentModule } from './agent/agent.module';
import { UploadModule } from './upload/upload.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: '.env.local',
      envFilePath: '.env.prod'
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
