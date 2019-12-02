import {
  Controller,
  Logger,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Body,
  Delete,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from 'src/shared/auth.gaurd';
import { User } from 'src/user/user.decorator';
import { CommentDTO } from './comment.dto';

@Controller('api/comments')
export class CommentController {
  logger = new Logger('CommentController');
  constructor(private commentService: CommentService) {}

  @Get('tweet/:id')
  showCommentsByTweet(@Param('id') tweet: string, @Query('page') page: number) {
    return this.commentService.showByTweet(tweet, page);
  }

  @Post('tweet/:id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createComment(
    @Param('id') tweet: string,
    @User('id') user: string,
    @Body() data: CommentDTO,
  ) {
    return this.commentService.create(tweet, user, data);
  }

  @Get('user/:id')
  showCommentsByUser(@Param('id') user: string, @Query('page') page: number) {
    return this.commentService.showByUser(user, page);
  }

  @Get(':id')
  showComment(@Param('id') id: string) {
    return this.commentService.show(id);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  destroyComment(@Param('id') id: string, @User('id') user: string) {
    return this.commentService.destroy(id, user);
  }
}
