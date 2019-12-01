import { 
    Entity, 
    PrimaryGeneratedColumn, 
    CreateDateColumn, 
    Column, 
    UpdateDateColumn, 
    ManyToOne} 
from "typeorm";
import { UserEntity } from "src/user/user.entity";

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
}