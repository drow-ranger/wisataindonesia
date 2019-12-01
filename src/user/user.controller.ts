import {
    Controller,
    Get,
    Post,
    UsePipes,
    Body,
    Query,
    Param,
    UseGuards,
    Logger,
  } from '@nestjs/common';
import { ValidationPipe } from '../shared/validation.pipe';
import { UserService } from './user.service';
import { UserDTO, UserLogin } from './user.dto';
import { AuthGuard } from 'src/shared/auth.gaurd';
import { User } from './user.decorator';

@Controller()
export class UserController {
  logger = new Logger('UserController');

  constructor(private userSerice: UserService) {}

  @Get('api/users')
  @UseGuards(new AuthGuard())
  showAllUsers(@User() user) {
    return this.userSerice.showAll();
  }

  @Post('auth/login')
  @UsePipes(new ValidationPipe())
  login(@Body() data: UserLogin) {
    this.logger.log(JSON.stringify(data));
    return this.userSerice.login(data);
  }

  @Post('auth/register')
  @UsePipes(new ValidationPipe())
  register(@Body() data: UserDTO) {
    this.logger.log(JSON.stringify(data));
    return this.userSerice.register(data);
  }
}