import { IsString } from 'class-validator';
import { UserRO } from 'src/user/user.dto';

export class TweetDTO {
  @IsString()
  readonly tweet: string;
}

export class TweetRO {
  id: string;
  created: Date;
  updated: Date;
  tweet: string;
  url: string;
  url_photo: string;
  url_tweet: string;
  author: UserRO;
}
