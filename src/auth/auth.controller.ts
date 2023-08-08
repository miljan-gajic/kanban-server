import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Request as TRequest } from 'express';
import { AuthService } from './auth.service';
import { GetUser, Public } from './decorators';
import { AuthDto } from './dto';
import { JwtRTGuard } from './guard';
import { GoogleOAuthGuard } from './guard/google.guard';

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

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('google/login')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Request() req) {}

  @Public()
  @UseGuards(GoogleOAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('google/redirect')
  googleLogIn(@Request() req: TRequest) {
    return this.authService.googleLogIn(req);
  }
}
