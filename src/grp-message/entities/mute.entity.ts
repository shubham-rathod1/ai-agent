import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GrpInstance } from './grp-instance.entity';

@Entity()
export class MutedUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  walletAddress: string;

  //   @ManyToOne(() => ChatInstance, (chatInstance) => chatInstance.id)
  //   chatInstance: ChatInstance;

  @CreateDateColumn()
  mutedAt: Date;
}
