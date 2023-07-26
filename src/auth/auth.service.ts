import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import {
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
} from './constants/tokens.constants';
import { AuthDto } from './dto';
import { Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto): Promise<{ msg: string; email: string }> {
    // Generate the password hash
    const hash = await this.hashData(dto.password);
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (existingUser) throw new BadRequestException('User already exists');

    try {
      // Save the new user in DB
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      return {
        msg: 'User has been created successfully',
        email: user.email,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Credentials taken, please try with different credentials',
          );
        }
      }
      throw error;
    }
  }

  async login(dto: AuthDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Credentials are incorrect');

    const pwMatches = await argon.verify(user.hash, dto.password);

    if (!pwMatches) throw new ForbiddenException('Credentials are incorrect');

    const tokens = await this.signToken(user.id, user.email);
    await this.updateRTHash(user.id, tokens['refresh_token']);

    return tokens;
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user || !user.hashedRt) throw new ForbiddenException('Access denied');

    const refreshTokenMatches = await argon.verify(user.hashedRt, refreshToken);
    if (!refreshTokenMatches) throw new ForbiddenException('Access denied');

    const tokens = await this.signToken(user.id, user.email);
    await this.updateRTHash(user.id, tokens['refresh_token']);

    return { ...tokens };
  }

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
  }

  // Util methods
  async hashData(data: string) {
    return await argon.hash(data);
  }

  async updateRTHash(userId: number, refreshToken: string) {
    const hash = await this.hashData(refreshToken);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }

  async signToken(userId: number, email: string): Promise<Tokens> {
    const payload = {
      sub: userId,
      email,
    };

    const secretAt = this.config.get('JWT_SECRET');
    const secretRt = this.config.get('REFRESH_TOKEN_SECRET');

    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRATION,
      secret: secretAt,
    });

    const accessCookie = `ACCESS_TOKEN=${accessToken}; HttpOnly; Path=/; Max-Age=${ACCESS_TOKEN_EXPIRATION}`;

    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: REFRESH_TOKEN_EXPIRATION,
      secret: secretRt,
    });

    const refreshCookie = `REFRESH_TOKEN=${refreshToken}; HttpOnly; Path=/; Max-Age=${REFRESH_TOKEN_EXPIRATION}`;

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
