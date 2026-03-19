import { BaseEntity } from 'src/common';
import { Library } from '../../library/entities/library.entity';
import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { UserRole } from '../auth.type';
import DatabaseFile from './databaseFile.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ type: 'timestamptz', nullable: true })
  resetPasswordExpires: Date;

  @Column({ nullable: true })
  logo: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @ManyToMany(() => Library)
  @JoinTable()
  libraries: Library[];

  @JoinColumn({ name: 'avatarId' })
  @OneToOne(() => DatabaseFile, {
    nullable: true,
  })
  public avatar?: DatabaseFile;

  @Column({ nullable: true })
  public avatarId?: number;
  // @Column({ type: 'json', nullable: true })
  // libraries?: Library[];
}
