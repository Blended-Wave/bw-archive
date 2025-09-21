import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { SeriesEntity } from './series.entity';
import { WorksFileEntity } from './worksFile.entity';
import { UserWorksEntity } from 'src/app/users/entities/user.works.entity';

@Entity('works')
export class WorksEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'thumb_url', type: 'varchar', length: 255, nullable: true })
  thumb_url: string;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  private_option: number;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  pinned_option: number;
  
  @Column({ type: 'varchar', length: 15, nullable: false, default: 'active' })
  status: string;
  
  @Column({ type: 'int', unsigned: true, default: 0 })
  views: number;

  @Column({ name: 'inactive_date', type: 'datetime', nullable: true })
  inactive_date: Date;
  
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => SeriesEntity, (series) => series.works, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'series_id' })
  series: SeriesEntity;

  @OneToOne(() => WorksFileEntity, (worksFile) => worksFile.works, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'works_file_id' })
  works_file: WorksFileEntity | null;

  @OneToMany(() => UserWorksEntity, (userWorks) => userWorks.works)
  user_works: UserWorksEntity[];
}
