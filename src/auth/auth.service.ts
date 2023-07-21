import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  login() {
    return { msg: 'I have created an account and want to SIGNIN!' };
  }

  signup() {
    return { msg: 'I have requested to sign up!' };
  }
}
