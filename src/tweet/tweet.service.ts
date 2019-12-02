import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TweetEntity } from './tweet.entity';
import { Repository } from 'typeorm';
import { TweetDTO, TweetRO } from './tweet.dto';
import { UserEntity } from 'src/user/user.entity';
import { Votes } from 'src/shared/votes.enum';

@Injectable()
export class TweetService {
  constructor(
    @InjectRepository(TweetEntity)
    private tweetRepository: Repository<TweetEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  private toResponseObject( tweet: TweetEntity ): TweetRO{
    const responseObject: any = {
      ...tweet,
      author: tweet.author ? tweet.author.toResponseObject(false) : null,
    };
    if (tweet.upvotes) {
      responseObject.upvotes = tweet.upvotes.length;
    }
    if (tweet.downvotes) {
      responseObject.downvotes = tweet.downvotes.length;
    }
    return responseObject;
  }

  private ensureOwnership(tweet: TweetEntity, userId: string) {
    if (tweet.author.id !== userId) {
      throw new HttpException('Incorrect User', HttpStatus.UNAUTHORIZED);
    }
  }

  private async vote(tweet: TweetEntity, user: UserEntity, vote: Votes) {
    const opposite = vote === Votes.UP ? Votes.DOWN : Votes.UP;
    if (
      tweet[opposite].filter(voter => voter.id === user.id).length > 0 ||
      tweet[vote].filter(voter => voter.id === user.id).length > 0
    ) {
      tweet[opposite] = tweet[opposite].filter(voter => voter.id !== user.id);
      tweet[vote] = tweet[vote].filter(voter => voter.id !== user.id);
      await this.tweetRepository.save(tweet);
    } else if (tweet[vote].filter(voter => voter.id === user.id).length < 1) {
      tweet[vote].push(user);
      await this.tweetRepository.save(tweet);
    } else {
      throw new HttpException('Unable to cast vote', HttpStatus.BAD_REQUEST);
    }

    return tweet;
  }

  async showAll(page: number = 1, newest?: boolean): Promise<TweetRO[]> {
    const tweets = await this.tweetRepository.find({ 
      relations: ['author', 'upvotes', 'downvotes', 'comments'],
      take: 50,
      skip: 50 * (page - 1),
      order: newest && { created: 'DESC' },
    });
    return tweets.map(tweet => this.toResponseObject(tweet));
  }

  async read(id: string): Promise<TweetRO> {
    const tweet = await this.tweetRepository.findOne({ 
      where: { id },
      relations: ['author', 'upvotes', 'downvotes', 'comments'],
    });
    if (!tweet) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return this.toResponseObject(tweet);
  }

  async create(userId: string, data: TweetDTO): Promise<TweetRO> {
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

  async update(id: string, userId: string, data: Partial<TweetDTO>): Promise<TweetRO> {
    let tweet = await this.tweetRepository.findOne({ 
      where: { id },
      relations: ['author', 'upvotes', 'downvotes', 'comments'],
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

  async destroy(id: string, userId: string): Promise<TweetRO> {
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

  async upvote(id: string, userId: string) {
    let tweet = await this.tweetRepository.findOne({
      where: { id },
      relations: ['author', 'upvotes', 'downvotes', 'comments'],
    });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    tweet = await this.vote(tweet, user, Votes.UP);

    return this.toResponseObject(tweet);
  }

  async downvote(id: string, userId: string) {
    let tweet = await this.tweetRepository.findOne({
      where: { id },
      relations: ['author', 'upvotes', 'downvotes', 'comments'],
    });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    tweet = await this.vote(tweet, user, Votes.DOWN);

    return this.toResponseObject(tweet);
  }

  async bookmark(id: string, userId: string) {
    const tweet = await this.tweetRepository.findOne({ where: { id } });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['bookmarks'],
    });

    if (user.bookmarks.filter(bookmark => bookmark.id === tweet.id).length < 1) {
      user.bookmarks.push(tweet);
      await this.userRepository.save(user);
    } else {
      throw new HttpException(
        'Tweet already bookmarked ',
        HttpStatus.BAD_REQUEST,
      );
    }

    return user.toResponseObject(false);
  }

  async unbookmark(id: string, userId: string) {
    const tweet = await this.tweetRepository.findOne({ where: { id } });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['bookmarks'],
    });

    if (user.bookmarks.filter(bookmark => bookmark.id === tweet.id).length > 0) {
      user.bookmarks = user.bookmarks.filter(
        bookmark => bookmark.id !== tweet.id,
      );
      await this.userRepository.save(user);
    } else {
      throw new HttpException('Cannot remove bookmark', HttpStatus.BAD_REQUEST);
    }

    return user.toResponseObject(false);
  }
}
