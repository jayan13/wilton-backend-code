import { User } from '../../auth/entities';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common';
import { Design } from 'src/design/entities/design.entity';
import { productConstruction, SampleSize } from '../dto/sample-size.type';

@Entity('sample_requests')
export class SampleRequest extends BaseEntity {
  @Column({
    type: 'enum',
    enum: SampleSize,
    default: SampleSize.FEET_1x2,
  })
  sampleSize: SampleSize;

  @Column({ type: 'json' })
  colors: string[];

  @Column({ type: 'xml' })
  patternImage: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'requestedBy' })
  requestedBy: User;

  @ManyToOne(() => Design, (design) => design.id)
  @JoinColumn({ name: 'design' })
  design: Design;

  @Column({
    type: 'enum',
    enum: productConstruction,
    nullable: true,
  })
  productConstruction: productConstruction;

  @Column({ nullable: true })
  pileType: string;
}
