import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TweetEntity } from './tweet.entity';
import { Repository } from 'typeorm';
import { TweetDTO, TweetRO } from './tweet.dto';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class TweetService {
  constructor(
    @InjectRepository(TweetEntity)
    private tweetRepository: Repository<TweetEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  private toResponseObject( tweet: TweetEntity ): TweetRO{
    return { 
      ...tweet, 
      author: tweet.author ? tweet.author.toResponseObject(false) : null 
    };
  }

  private ensureOwnership(tweet: TweetEntity, userId: string) {
    if (tweet.author.id !== userId) {
      throw new HttpException('Incorrect User', HttpStatus.UNAUTHORIZED);
    }
  }

  async showAll() {
    const tweets = await this.tweetRepository.find({ 
      relations: ['author'] 
    });
    return tweets.map(tweet => this.toResponseObject(tweet));
  }

  async read(id: string) {
    const tweet = await this.tweetRepository.findOne({ 
      where: { id },
      relations: ['author'],
    });

    if (!tweet) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return this.toResponseObject(tweet);
  }

  async create(userId: string, data: TweetDTO) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    const tweet = await this.tweetRepository.create({
      ...data,
      author: user
    });
    await this.tweetRepository.save(tweet);
    return this.toResponseObject(tweet);
  }

  async update(id: string, userId: string, data: Partial<TweetDTO>) {
    let tweet = await this.tweetRepository.findOne({ 
      where: { id },
      relations: ['author'],
    });
    if (!tweet) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    this.ensureOwnership(tweet, userId);
    await this.tweetRepository.update({ id }, data);
    tweet = await this.tweetRepository.findOne({ 
      where: { id },
      relations: ['author'],
    });
    return this.toResponseObject(tweet);
  }

  async destroy(id: string, userId: string) {
    const tweet = await this.tweetRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!tweet) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    this.ensureOwnership(tweet, userId);
    await this.tweetRepository.remove(tweet);
    return this.toResponseObject(tweet);
  }
}
