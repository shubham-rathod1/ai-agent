import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;  // 'free', 'pro', 'premium'

  @Column()
  monthlyPrice: number;  // e.g., 0, 20, 50

  @Column()
  aiRequestLimit: number; // Max AI calls per month

  @Column()
  prioritySupport: boolean;
}
