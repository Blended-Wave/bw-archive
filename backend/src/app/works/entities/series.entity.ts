import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { WorksEntity } from './works.entity';

@Entity('series')
export class SeriesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => WorksEntity, (work) => work.series)
  works: WorksEntity[];
}
