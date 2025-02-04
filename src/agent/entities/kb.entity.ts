import { KbTypes } from 'src/helper/enums';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class KnowledgeBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  aId: string;

  @Column()
  filename: string;

  @Column()
  typ: KbTypes;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
