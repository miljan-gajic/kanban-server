import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorators';
import { JwtGuard } from '../auth/guard';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('current_user')
  async currentUser(@GetUser('userId') userId: number) {
    return this.userService.getCurrentUser(userId);
  }
}
