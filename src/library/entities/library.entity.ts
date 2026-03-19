import { User } from '../../auth/entities';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common';

@Entity('libraries')
export class Library extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;
}
