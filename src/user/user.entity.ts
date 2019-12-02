import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { UserRO } from './user.dto';
import { TweetEntity } from 'src/tweet/tweet.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({
    type: 'text',
    unique: true,
  })
  username: string;

  @Column('text')
  name: string;

  @Column('text')
  password: string;

  @OneToMany(
    type => TweetEntity,
    tweet => tweet.author,
  )
  tweets: TweetEntity[];

  @ManyToMany(
    type => TweetEntity,
    { cascade: true })
  @JoinTable()
  bookmarks: TweetEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }

  toResponseObject(showToken: boolean = true): UserRO {
    const { id, created, updated, username, name, token } = this;
    const responseObject: UserRO = {
      id,
      created,
      updated,
      username,
      name,
    };

    if (this.tweets) {
      responseObject.tweets = this.tweets;
    }

    if (this.bookmarks) {
      responseObject.bookmarks = this.bookmarks;
    }

    if (showToken) {
      responseObject.token = token;
    }

    return responseObject;
  }

  private get token(): string {
    const { id, username } = this;

    return jwt.sign(
      {
        id,
        username,
      },
      process.env.SECRET,
      { expiresIn: '7d' },
    );
  }
}
