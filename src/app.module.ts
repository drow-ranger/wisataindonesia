import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from './api.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ApiModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
