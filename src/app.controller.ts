import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('err')
  err() {
    throw new HttpException(
      {
        statusCode: HttpStatus.FORBIDDEN,
        error: 'Forbidden',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
