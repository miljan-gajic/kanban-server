import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  login() {
    return { msg: 'I have created an account and want to SIGNIN!' };
  }

  signup() {
    return { msg: 'I have requested to sign up!' };
  }
}
