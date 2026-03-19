import { User } from '../../auth/entities';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '../../common';
import { ColorCategory } from 'src/color-category/entities/color-category.entity';

@Entity('company_colors')
export class CompanyColor extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column()
  colorCode: string;

  @Column({ nullable: true })
  code: string;

  @ManyToMany(() => ColorCategory)
  @JoinTable()
  colorCategories: ColorCategory[];

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;
}
