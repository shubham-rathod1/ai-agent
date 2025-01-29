import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as crypto from 'crypto';

@Entity()
export class User {
  @PrimaryColumn({ unique: true })
  id: string;

  @Column()
  address: string;
  // check type or address whether it is solana or evm
  @Column()
  typ: string;

  @BeforeInsert()
  generateId() {
    this.id = crypto.randomBytes(6).toString('hex');
  }
}

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uid: string;

  @Column()
  token: string;
  // status 1 or active and 0 for inactive
  @Column({ default: 1 })
  sts: number;

  @Column()
  ip: string;

  // created at time
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  cta: Date;

  // updated at time
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  uta: Date;
}
