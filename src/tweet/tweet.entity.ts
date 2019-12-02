import { 
    Entity, 
    PrimaryGeneratedColumn, 
    CreateDateColumn, 
    Column, 
    UpdateDateColumn, 
    ManyToOne,
    ManyToMany,
    JoinTable,
    OneToMany} 
from "typeorm";
import { UserEntity } from "src/user/user.entity";
import { CommentEntity } from "src/comment/comment.entity";

@Entity('tweet')
export class TweetEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    created: Date;
  
    @UpdateDateColumn()
    updated: Date;

    @Column('text')
    tweet: string

    @Column('text', { nullable: true })
    url: string

    @Column('text', { nullable: true })
    url_photo: string

    @Column('text', { nullable: true })
    url_tweet: string

    @ManyToOne(
        type => UserEntity,
        author => author.tweets)
    author: UserEntity;
    
    @ManyToMany(
        type => UserEntity,
        { cascade: true })
    @JoinTable()
    upvotes: UserEntity[];

    @ManyToMany(
        type => UserEntity,
        { cascade: true })
    @JoinTable()
    downvotes: UserEntity[];

    @OneToMany(
        type => CommentEntity,
        comment => comment.tweet,
        { cascade: true })
    comments: CommentEntity[];
}