import { Test, TestingModule } from '@nestjs/testing';
import { TweetController } from './tweet.controller';

describe('Tweet Controller', () => {
  let controller: TweetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TweetController],
    }).compile();

    controller = module.get<TweetController>(TweetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
