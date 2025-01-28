import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

//   @Column()
//   uid: number;

  @Column()
  address: string;
  // check type or address whether it is solana or evm
  @Column()
  typ: string;
}

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  aid: number;

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