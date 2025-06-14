import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as crypto from 'crypto';

@Entity()
export class Auth {
  @PrimaryColumn({ unique: true })
  id: string;
  @Column({ unique: true })
  uId: string;
  @Column()
  address: string;
  @Column()
  typ: string;
  @CreateDateColumn()
  cta: Date;
  @UpdateDateColumn()
  uta: Date;
  @BeforeInsert()
  generateId() {
    this.id = crypto.randomBytes(6).toString('hex');
  }
}

@Entity()
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: number;
  @Column({ type: 'uuid' })
  uId: string;
  @Column()
  token: string;
  @Column({ default: 1 })
  sts: number;
  @Column()
  ip: string;
  @CreateDateColumn()
  cta: Date;
  @UpdateDateColumn()
  uta: Date;
}
