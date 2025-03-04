import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { WorksEntity } from './works.entity';

@Entity('thumbnail')
export class ThumbnailEntity {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column({ type: 'text' })
    image_url: string;

    @OneToOne(()=>WorksEntity, (works)=>works.thumbnail )
    works: WorksEntity;

    @Column({ type: 'datetime', precision: 6 })
    created_at: Date;

    @Column({ type: 'datetime', precision: 6 })
    updated_at: Date;
}
