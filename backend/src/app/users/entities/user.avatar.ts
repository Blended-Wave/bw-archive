import { Entity, PrimaryGeneratedColumn,CreateDateColumn, UpdateDateColumn,Column, ManyToOne,JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity'; // UserEntity 파일 경로에 맞게 변경하세요.

@Entity('user_avatar')
export class UserAvatar {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column({ type: 'text', nullable: true })
    image_url: string;

    @CreateDateColumn({ type: 'timestamp', precision: 6, default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', precision: 6, default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updated_at: Date;

    @ManyToOne(() => UserEntity)
    @JoinColumn()
    user: UserEntity;
}