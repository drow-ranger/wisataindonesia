import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TweetEntity } from 'src/tweet/tweet.entity';
import { UserEntity } from 'src/user/user.entity';
import { CommentEntity } from './comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity, TweetEntity, UserEntity])],
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentModule {}
