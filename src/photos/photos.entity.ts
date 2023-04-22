import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../auth/user/user.entity';

@Entity()
export class Photos extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar' })
  fileName: string;
  f;
  @Column({ type: 'bytea' })
  data: Uint8Array;

  @ManyToOne(() => User, (user) => user.photos)
  user: User;
}
