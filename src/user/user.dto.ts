import { IsNotEmpty } from 'class-validator';
import { TweetEntity } from 'src/tweet/tweet.entity';

export class UserDTO {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  name: string;
}

export class UserLogin {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;
}

export class UserRO {
  id: string;
  username: string;
  name: string;
  created: Date;
  updated: Date;
  token?: string;
  tweets?: TweetEntity[];
}