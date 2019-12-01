import { Module } from '@nestjs/common';
import { TweetController } from './tweet.controller';
import { TweetService } from './tweet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TweetEntity } from './tweet.entity';
import { UserEntity } from 'src/user/user.entity';

@Module({  
  imports: [TypeOrmModule.forFeature([TweetEntity, UserEntity])],
  controllers: [TweetController],
  providers: [TweetService]
})
export class TweetModule {}
