import { AgentType, BrowserType, ModelId } from 'src/helper/enums';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as crypto from 'crypto';
import { Token } from 'src/helper/types';
import { User } from 'src/users/entities/user.entity';
import { ChatSession } from 'src/chat-session/entities/chat-session.entity';

@Entity()
export class Agent {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  uId: string;
  @Column({ unique: true })
  name: string;
  @Column({ default: 'private' })
  interfaceType: string;
  @Column()
  model_id: ModelId;
  @Column()
  search_engine_id: BrowserType;
  @Column()
  persona: string;
  @Column({ type: 'jsonb' })
  token: Token;
  @Column()
  pic: string;
  @Column({ type: 'jsonb', nullable: true })
  telegram?: {
    botToken: string;
  };
  @Column({ type: 'jsonb', nullable: true })
  discord?: {
    botToken: string;
  };
  @Column({ type: 'jsonb', nullable: true })
  x?: {
    id: string;
    username: string;
  };
  @Column()
  desc: string;
  @Column()
  typ: AgentType;
  @Column({ nullable: true })
  vibility: string;
  @CreateDateColumn()
  cta: Date;
  @UpdateDateColumn()
  uta: Date;
  @ManyToOne(() => User, (user) => user.agents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'uId' })
  user: User;
  @OneToMany(() => ChatSession, (session) => session.agent, { cascade: true })
  chatSessions: ChatSession[];
  // @BeforeInsert()
  // generateId() {
  //   this.id = crypto.randomBytes(6).toString('hex');
  // }
}
