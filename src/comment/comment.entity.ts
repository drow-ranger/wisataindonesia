import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
  JoinTable,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { TweetEntity } from 'src/tweet/tweet.entity';


@Entity('comment')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column('text')
  comment: String;

  @ManyToOne(type => UserEntity)
  @JoinTable()
  author: UserEntity;

  @ManyToOne(
    type => TweetEntity,
    tweet => tweet.comments,
  )
  tweet: TweetEntity;
}
