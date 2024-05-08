import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('thumbnail')
export class ThumbnailEntity {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column({ type: 'text' })
    image_url: string;

    @Column({ type: 'datetime', precision: 6 })
    created_at: Date;

    @Column({ type: 'datetime', precision: 6 })
    updated_at: Date;
}
