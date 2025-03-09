import { Entity, PrimaryGeneratedColumn,UpdateDateColumn,CreateDateColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { WorksEntity } from '../../works/entities/works.entity';

@Entity('user_works')
export class UserWorksEntity {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @ManyToOne(() => WorksEntity)
    @JoinColumn({ name: 'works_id' })
    works: WorksEntity;

    @Column({ type: 'int', nullable: false })
    is_main: boolean; // true -> main_artist, false -> credits[]

    @CreateDateColumn({ type: 'timestamp', precision: 6, default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', precision: 6, default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updated_at: Date;
}
