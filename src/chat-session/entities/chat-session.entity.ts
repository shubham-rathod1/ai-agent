import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Agent } from '../../agent/entities/agent.entity';
import { ChatMessage } from 'src/chat-message/entities/chat-message.entity';
//   import { ChatMessage } from '../../';

@Entity()
export class ChatSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  aId: string;

  @Column()
  uId: string;

  @ManyToOne(() => User, (user) => user.chatSessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'uId' })
  user: User;

  @ManyToOne(() => Agent, (agent) => agent.chatSessions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'aId' })
  agent: Agent;

  @UpdateDateColumn()
  uta: Date;

  @OneToMany(() => ChatMessage, (message) => message.session, { cascade: true })
  messages: ChatMessage[];

  @CreateDateColumn()
  cta: Date;
}
