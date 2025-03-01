import { Column, BeforeUpdate, Entity, CreateDateColumn,UpdateDateColumn , PrimaryGeneratedColumn, RelationId } from "typeorm";
@Entity('users') // 이름, 동기화, 정렬 설정 및 엔진 지정이 가능 (동기화는 개발중에는 true 운영에서는 flase권장)
export class UserEntity {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column({ type: 'varchar', length: 30, nullable: false })
    login_id: string;

    @Column({ type: 'varchar', length: 256, nullable: false }) // hash 처리 필요
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

    @CreateDateColumn({ type: 'timestamp', precision: 6, default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', precision: 6, default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updated_at: Date;
}
