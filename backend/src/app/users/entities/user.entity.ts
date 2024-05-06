import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from "typeorm";
@Entity('users') // 이름, 동기화, 정렬 설정 및 엔진 지정이 가능 (동기화는 개발중에는 true 운영에서는 flase권장)
export class UserEntity {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column({ type: 'varchar', length: 30, nullable: false })
    loginId: string;

    @Column({ type: 'varchar', length: 256, nullable: false }) // hash 처리 필요
    password: string;

    @Column({ type: 'varchar', length: 30, nullable: false })
    nickname: string;

    @Column({ type: 'text', nullable: true })
    twitterUrl: string | null;

    @Column({ type: 'text', nullable: true })
    instarUrl: string | null;

    @Column({ type: 'date', nullable: false })
    createdAt: Date;

    @Column({ type: 'date', nullable: false })
    updatedAt: Date;
}
