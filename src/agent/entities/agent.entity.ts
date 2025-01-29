import { AgentType } from 'src/helper/enums';
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import * as crypto from 'crypto';
import { Token } from 'src/helper/types';

@Entity()
export class Agent {
  @PrimaryColumn({ unique: true })
  id: string;
  @Column()
  uid: string;
  @Column({ unique: true })
  name: string;
  @Column('text', { array: true })
  instructions: string[];
  @Column()
  personality: string;
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

  @BeforeInsert()
  generateId() {
    this.id = crypto.randomBytes(6).toString('hex');
  }
}
