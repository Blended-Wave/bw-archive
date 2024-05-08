import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
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

    @Column({ type: 'date', nullable: false })
    created_at: Date;

    @Column({ type: 'date', nullable: false })
    updated_at: Date;
}
