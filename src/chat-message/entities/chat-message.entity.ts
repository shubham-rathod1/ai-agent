import { ChatSession } from 'src/chat-session/entities/chat-session.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
//   import { ChatSession } from './ChatSession';

export enum ChatRole {
  USER = 'user',
  ASSISTANT = 'assistant',
}

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cSessionId: string;

  @Column({ nullable: true })
  pId: number;

  @ManyToOne(() => ChatSession, (session) => session.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cSessionId' })
  session: ChatSession;

  @Column({ type: 'enum', enum: ChatRole })
  role: ChatRole;

  @Column({ type: 'text' })
  message: string;

  @ManyToOne(() => ChatMessage, (message) => message.responses, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'pId' })
  parentMessage: ChatMessage;

  @OneToMany(() => ChatMessage, (message) => message.parentMessage)
  responses: ChatMessage[];

  @CreateDateColumn()
  cta: Date;
}
