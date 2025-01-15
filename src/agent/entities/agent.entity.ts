import { AgentType } from 'src/helper/enums';
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import * as crypto from 'crypto';
import utils from 'ethers';
import { Token } from 'src/helper/types';

@Entity()
export class Agent {
  @PrimaryColumn({ unique: true })
  id: string;
  @Column({ unique: true })
  name: string;
  @Column({ type: 'jsonb' })
  token: Token;
  @Column()
  pic: string;
  @Column()
  bio: string;
  @Column()
  typ: AgentType;
  @Column({ nullable: true })
  vibility: string;

  @BeforeInsert()
  generateId() {
    this.id = crypto.randomBytes(8).toString('hex');
  }
  //   @BeforeInsert()
  //   validateTokenAddress() {
  //     if (!utils.isAddress(this.tCAddress)) {
  //       throw new Error('Invalid token address format.');
  //     }
  //   }
}
