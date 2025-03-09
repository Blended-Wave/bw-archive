import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';

@Entity('users')
@Unique(['login_id']) 
export class UserEntity {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column({ type: 'varchar', length: 30, nullable: false })
    login_id: string;

    @Column({ type: 'varchar', length: 256, nullable: false })
    password: string;

    @Column({ type: 'varchar', length: 30, nullable: false })
    nickname: string;

    @Column({ type: 'varchar', length: 15, nullable: false, default: 'active' })
    status: string;

    @Column({ type: 'timestamp', nullable: true })
    inactive_date: Date;

    @Column({ type: 'text', nullable: true })
    twitter_url: string | null;

    @Column({ type: 'text', nullable: true })
    instar_url: string | null;


    @Column({ type: 'text', nullable: true })
    avatar_url: string | null;  // 아바타 URL을 여기에서 관리

    @CreateDateColumn({ type: 'timestamp', precision: 6, default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', precision: 6, default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updated_at: Date;
}
