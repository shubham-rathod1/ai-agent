import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GrpInstance } from './grp-instance.entity';

@Entity()
export class GrpMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  senderAddress: string;

  @Column()
  content: string;

  @Column()
  instanceId: number;

  @Column({ nullable: true })
  hash: string;

  @Column({ nullable: true })
  amnt: string;

  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => GrpInstance, (grpInstance) => grpInstance.grpMessage)
  @JoinColumn({ name: 'instanceId' })
  grpInstance: GrpInstance;
}
