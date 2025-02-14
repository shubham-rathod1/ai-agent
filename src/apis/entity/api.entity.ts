import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  JoinColumn,
} from 'typeorm';
import * as crypto from 'crypto';
import { User } from '../../users/entities/user.entity';

@Entity()
export class ApiKey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uId: string; // Key label for user reference

  @Column({ unique: true })
  key: string; // Hashed API key

  @Column({ default: true })
  active: boolean; // Can be disabled

  // @ManyToOne(() => User, (user) => user.apikey, { onDelete: 'CASCADE' })
  // @JoinColumn({name: 'uId'})
  // user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  generateApiKey() {
    this.key = crypto.randomBytes(32).toString('hex'); // Store securely
  }
}
