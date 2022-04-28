import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../../user/services/user/user.service';
import { Credentials, SignInResponse } from '../../interfaces/signin.interface';
import { UserInfo } from '../../../user/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async validateUser(credentials: Credentials): Promise<UserInfo | undefined> {
    const user = await this.userService.findOne(credentials.username);

    if (user && user.password === credentials.password) {
      const { password, ...rest } = user;
      return rest;
    }

    return null;
  }

  async signIn(user: UserInfo): Promise<SignInResponse> {
    const payload = { username: user.username, sub: user.id };
    return { accessToken: this.jwtService.sign(payload) };
  }

  googleSignIn(req) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }
}
