import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { TweetEntity } from 'src/tweet/tweet.entity';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CommentDTO } from './comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    @InjectRepository(TweetEntity)
    private tweetRepository: Repository<TweetEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  private toResponseObject(comment: CommentEntity) {
    return {
      ...comment,
      author: comment.author && comment.author.toResponseObject(),
    };
  }

  async showByTweet(tweetId: string, page: number = 1) {
    const comments = await this.commentRepository.find({
      where: { tweet: { id: tweetId } },
      relations: ['comments', 'comments.author', 'comments.tweet'],
      take: 50,
      skip: 50 * (page - 1),
    });

    return comments.map(comment => this.toResponseObject(comment));
  }

  async showByUser(userId: string, page: number = 1) {
    const comments = await this.commentRepository.find({
      where: { author: { id: userId } },
      relations: ['author', 'tweet'],
      take: 50,
      skip: 50 * (page - 1),
    });
    return comments.map(comment => this.toResponseObject(comment));
  }

  async show(id: string) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'tweet'],
    });
    return this.toResponseObject(comment);
  }

  async create(tweetId: string, userId: string, data: CommentDTO) {
    const tweet = await this.tweetRepository.findOne({
      where: { id: tweetId },
    });
    const user = await this.userRepository.findOne({ 
      where: { id: userId } 
    });
    const comment = await this.commentRepository.create({
      ...data,
      tweet,
      author: user,
    });
    await this.commentRepository.save(comment);
    return this.toResponseObject(comment);
  }

  async destroy(id: string, userId: string) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'tweet'],
    });

    if (comment.author.id !== userId) {
      throw new HttpException(
        'You do not own this comment',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.commentRepository.remove(comment);
    return this.toResponseObject(comment);
  }
}
