import { Module } from "@nestjs/common";
import { TweetModule } from "./tweet/tweet.module";
import { UserModule } from "./user/user.module";
import { CommentModule } from "./comment/comment.module";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { HttpErrorFilter } from "./shared/http-error.filter";
import { LoggingInterceptor } from "./shared/logging.interceptor";

@Module({
  imports: [TweetModule, UserModule, CommentModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  exports: [TweetModule, UserModule, CommentModule],
})
export class ApiModule {}
