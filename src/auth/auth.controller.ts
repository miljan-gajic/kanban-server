import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetUser, Public } from './decorators';
import { AuthDto } from './dto';
import { JwtRTGuard } from './guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  logout(@GetUser('userId') userId: number) {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(JwtRTGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refreshTokens(
    @GetUser('userId') userId: number,
    @GetUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
