import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from "typeorm";
//엔터티 정의는 엔터티 스키마를 사용하는 것이 더 나을 수도 있다 무엇이 나을지는 nest 깃허브에서 예제 코드를 보고 판단해보자
@Entity('Users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    avatarPath: string;
    
    @PrimaryColumn()
    userId: string;

    @Column()
    userPassword: string;

    @Column()
    nickname: string;

    @Column()
    role: string; // mysql 에서는 array데이터 형식을 지원하지 않는다. role은 여러개의 문자열을 받아야한다. role엔터티 따로 만들어서 many to many(테이블 조인)

    @Column()
    twitterAddress: string;

    @Column()
    instagramAddress: string;

    // @RelationId((works:WorksEntities)=> works.count)
    // worksCount: number; // works 테이블에서 카운트 가져오기, jotube 만들때 댓글기능으로 어찌저찌 했던 것 같은데
    
    // @RelationId((works:WorksEntities)=> works.img)
    // worksImgPath: string[]; // 유저랑, 유저가 작업한 작업물들 M:N으로 묶어서 가져와야함 하나의 작업물에 여러명의 유저가 엮일 수 있음
    
    // @RelationId((comment:CommentEntities)=> comment)
    // userComment: Comment; // 유저가 작성한 댓글 모아서 정리하는 기능이 필요할지 모르겠음

    @Column()
    isAdmin: boolean;
}