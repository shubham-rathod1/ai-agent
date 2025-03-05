import { Module } from '@nestjs/common';
import { GrpMessageService } from './grp-message.service';
import { GrpMessageController } from './grp-message.controller';
import { GrpMessage } from './entities/grp-message.entity';
import { Session } from 'src/auth/entities/auth.entity';
import { BullModule } from '@nestjs/bullmq';
import { GrpInstance } from './entities/grp-instance.entity';
import { MutedUser } from './entities/mute.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([GrpMessage, Session, GrpInstance, MutedUser]),
    BullModule.registerQueue({
      name: 'grpChat',
    }),
  ],
  controllers: [GrpMessageController],
  providers: [GrpMessageService],
})
export class GrpMessageModule {}
