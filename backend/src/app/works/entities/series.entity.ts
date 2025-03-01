import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('series')
export class SeriesEntity {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column({ type: 'varchar', length: 30, nullable: false })
    name: string;

    @Column({ type: 'text', nullable: false })
    description: string;

    @Column({ type: 'datetime', precision: 6, nullable: false })
    created_at: Date;

    @Column({ type: 'datetime', precision: 6, nullable: false })
    updated_at: Date;
}
