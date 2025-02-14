import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as crypto from 'crypto';
import { MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { Agent } from '../../agent/entities/agent.entity';
import { ApiKey } from 'src/apis/entity/api.entity';
import { ChatSession } from 'src/chat-session/entities/chat-session.entity';

@Entity()
export class User {
  // @PrimaryColumn({ unique: true })
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  @MaxLength(15)
  @Transform(({ value }) => value.toLowerCase())
  uName: string;
  @Column({ nullable: true, unique: true })
  email?: string;
  // @Column({ default: 'free' }) // ['free', 'pro', 'premium']
  // subscription: string;
  // @Column({ nullable: true })
  // api: string;
  @Column({ type: 'jsonb', nullable: true })
  img?: {
    pro?: string;
    cvr?: string;
  };
  @Column({ type: 'jsonb', nullable: true })
  telegram?: {
    id: string;
    username: string;
  };
  @Column({ type: 'jsonb', nullable: true })
  discord?: {
    id: string;
    username: string;
  };
  @Column({ type: 'jsonb', nullable: true })
  x?: {
    id: string;
    username: string;
  };
  @CreateDateColumn()
  cta: Date;
  @UpdateDateColumn()
  uta: Date;

  // @OneToMany(() => Agent, (agent) => agent.user)
  // agent: Agent[];

  @OneToMany(() => Agent, (agent) => agent.user, { cascade: true })
  agents: Agent[];

  @OneToMany(() => ChatSession, (session) => session.user, { cascade: true })
  chatSessions: ChatSession[];

  // @OneToMany(() => ApiKey, (apikey) => apikey.user, { cascade: true })
  // apikey: ApiKey[];
  // @BeforeInsert()
  // generateId() {
  //   this.id = crypto.randomBytes(6).toString('hex');
  // }
}
