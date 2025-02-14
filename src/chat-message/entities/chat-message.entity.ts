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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cSessionId: string;

  @ManyToOne(() => ChatSession, (session) => session.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cSessionId' })
  session: ChatSession;

  @Column({ type: 'enum', enum: ChatRole })
  role: ChatRole;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => ChatMessage, (message) => message.responses, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  parentMessage: ChatMessage;

  @OneToMany(() => ChatMessage, (message) => message.parentMessage)
  responses: ChatMessage[];

  @CreateDateColumn()
  cta: Date;
}
