import { User } from '../../auth/entities';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '../../common';
import { Library } from 'src/library/entities/library.entity';

@Entity('designs')
export class Design extends BaseEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  designNumber: string;

  @Column({ nullable: true })
  productConstruction: string;

  @Column({ nullable: true })
  picksMtr: string;

  @Column({ nullable: true })
  pileType: string;

  @Column({ nullable: true })
  repeatSize: string;

  @Column({ type: 'json' })
  colors: string[];

  @Column({ type: 'xml' })
  patternImage: string;

  @ManyToMany(() => Library)
  @JoinTable()
  libraries: Library[];

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @Column()
  createdRole: string;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
