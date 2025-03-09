import { Entity, BeforeUpdate, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { SeriesEntity } from './series.entity';
import { WorksFileEntity } from './worksFile.entity';


@Entity('works')
export class WorksEntity {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @ManyToOne(() => SeriesEntity)
    @JoinColumn({ name: 'series_id' })
    series: SeriesEntity;
    
    @Column({ type: 'text', nullable: true })
    thumbnail_url: string |  null;

    @OneToOne(() => WorksFileEntity)
    @JoinColumn({ name: 'works_file_id' })
    works_file: WorksFileEntity;

    @Column({ type: 'varchar', length: 30, nullable: false })
    title: string;
    
    @Column({ type: 'varchar', length: 15, nullable: false })
    type: string;

    @Column({ type: 'int', unsigned: true, nullable: false })
    views: number;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'int', nullable: false })
    pinned_option: number;

    @Column({ type: 'int', nullable: false })
    private_option: number;
    
    @Column({ type: 'varchar', length: 15, nullable: false, default: 'active' })
    status: string;
    

    @Column({ type: 'timestamp', nullable: true })
    inactive_date: Date;

    @Column({ type: 'date', nullable: false })
    created_at: Date;

    @Column({ type: 'date', nullable: false })
    updated_at: Date;

    @BeforeUpdate()
    setInactiveDate() {
        if (this.status === 'inactive' && !this.inactive_date) {
            this.inactive_date = new Date();
        }
    }
}
