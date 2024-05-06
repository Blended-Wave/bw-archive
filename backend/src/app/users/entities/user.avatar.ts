import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity'; // UserEntity 파일 경로에 맞게 변경하세요.

@Entity('user_avatar')
export class UserAvatar {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column({ type: 'text', nullable: true })
    image_url: string;

    @Column({ type: 'date', nullable: false })
    created_at: Date;

    @Column({ type: 'date', nullable: false })
    updated_at: Date;

    @ManyToOne(() => UserEntity)
    @JoinColumn()
    user: UserEntity;
}