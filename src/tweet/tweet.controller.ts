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
} from '@nestjs/common';
import { TweetService } from './tweet.service';
import { TweetDTO } from './tweet.dto';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { AuthGuard } from 'src/shared/auth.gaurd';
import { User } from 'src/user/user.decorator';

@Controller('api/tweets')
export class TweetController {
  private logger = new Logger('TweetController');

  constructor(private ideaService: TweetService) {}

  private logData(options: any) {
    options.user && this.logger.log('USER ' + JSON.stringify(options.user));
    options.data && this.logger.log('BODY ' + JSON.stringify(options.data));
    options.id && this.logger.log('IDEA ' + JSON.stringify(options.id));
  }

  @Get()
  showAllTweets() {
    this.logger.log('show idea');
    return this.ideaService.showAll();
  }

  @Post()
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createTweet(@User('id') user, @Body() data: TweetDTO) {
    this.logData({
      user,
      data,
    });
    return this.ideaService.create(user, data);
  }

  @Get(':id')
  readTweet(@Param('id') id: string) {
    this.logData({ 
      id 
    });
    return this.ideaService.read(id);
  }

  @Put(':id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  updateTweet(@Param('id') id: string, @User('id') user, @Body() data: Partial<TweetDTO>) {
    this.logData({ id, user, data });
    return this.ideaService.update(id, user, data);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  destroyTweet(@Param('id') id: string, @User('id') user) {
    this.logData({ id, user });
    return this.ideaService.destroy(id, user);
  }
}
