import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GrpMessage } from './grp-message.entity';

@Entity()
export class GrpInstance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  adminAddress: string;

  @Column('text', { array: true, default: '{}' })
  moderators: string[];

  @Column()
  streamUrl: string;

  @Column()
  aId: string;

  @Column()
  tokenAddress: string;

  @Column({ type: 'decimal', precision: 20, scale: 8 })
  minTokenValue: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => GrpMessage, (grpMessage) => grpMessage.grpInstance)
  grpMessage: GrpMessage[];
}
