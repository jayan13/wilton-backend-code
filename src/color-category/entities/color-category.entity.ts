import { User } from '../../auth/entities';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common';

@Entity('color-category')
export class ColorCategory extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column()
  colorCode: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ type: 'int', nullable: true, default: null })
  order: number | null;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;
}
