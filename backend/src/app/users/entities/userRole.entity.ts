import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn,JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity'; // UserEntity는 이전에 작성한 사용자 엔터티입니다.
import { RoleEntity } from './role.entity';

@Entity('user_role')
export class UserRole {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @ManyToOne(() => UserEntity)
    @JoinColumn()
    user: UserEntity;
    
    @ManyToOne(() => RoleEntity)
    @JoinColumn()
    role: RoleEntity;
    

    @CreateDateColumn({ type: 'timestamp', precision: 6, default: () => 'CURRENT_TIMESTAMP(6)' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', precision: 6, default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updatedAt: Date;
}
