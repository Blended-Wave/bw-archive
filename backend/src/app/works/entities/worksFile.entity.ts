import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
//이거랑 유저 아바타는 1:1관계?
@Entity('works_file')
export class WorksFileEntity {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column({ type: 'text' })
    file_url: string;

    @Column({ type: 'varchar', length: 30 })
    type: string;

    @Column({ type: 'int', unsigned: true })
    size: number;

    @Column({ type: 'datetime', precision: 6 })
    created_at: Date;

    @Column({ type: 'datetime', precision: 6 })
    updated_at: Date;
}
