import {
  Controller,
  Get,
  Post,
  Logger,
  Body,
  Put,
  Delete,
  Param,
  UsePipes,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TweetService } from './tweet.service';
import { TweetDTO } from './tweet.dto';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { AuthGuard } from 'src/shared/auth.gaurd';
import { User } from 'src/user/user.decorator';

@Controller('api/tweets')
export class TweetController {
  private logger = new Logger('TweetController');

  constructor(private tweetService: TweetService) {}

  private logData(options: any) {
    options.user && this.logger.log('USER ' + JSON.stringify(options.user));
    options.data && this.logger.log('BODY ' + JSON.stringify(options.data));
    options.id && this.logger.log('TWEET ' + JSON.stringify(options.id));
  }

  @Get()
  showAllTweets(@Query('page') page: number) {
    return this.tweetService.showAll(page);
  }

  @Get('/newest')
  showNewestTweets(@Query('page') page: number) {
    return this.tweetService.showAll(page, true);
  }

  @Post()
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createTweet(@User('id') user, @Body() data: TweetDTO) {
    this.logData({
      user,
      data,
    });
    return this.tweetService.create(user, data);
  }

  @Get(':id')
  readTweet(@Param('id') id: string) {
    this.logData({ 
      id 
    });
    return this.tweetService.read(id);
  }

  @Put(':id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  updateTweet(@Param('id') id: string, @User('id') user, @Body() data: Partial<TweetDTO>) {
    this.logData({ id, user, data });
    return this.tweetService.update(id, user, data);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  destroyTweet(@Param('id') id: string, @User('id') user) {
    this.logData({ id, user });
    return this.tweetService.destroy(id, user);
  }

  @Post(':id/upvote')
  @UseGuards(new AuthGuard())
  upvoteTweet(@Param('id') id: string, @User('id') user: string) {
    this.logData({ id, user });
    return this.tweetService.upvote(id, user);
  }

  @Post(':id/downvote')
  @UseGuards(new AuthGuard())
  downvoteTweet(@Param('id') id: string, @User('id') user: string) {
    this.logData({ id, user });
    return this.tweetService.downvote(id, user);
  }

  @Post(':id/bookmark')
  @UseGuards(new AuthGuard())
  bookmarkTweet(@Param('id') id: string, @User('id') user: string) {
    this.logData({ id, user });
    return this.tweetService.bookmark(id, user);
  }

  @Delete(':id/bookmark')
  @UseGuards(new AuthGuard())
  unbookmarkTweet(@Param('id') id: string, @User('id') user: string) {
    this.logData({ id, user });
    return this.tweetService.unbookmark(id, user);
  }
}