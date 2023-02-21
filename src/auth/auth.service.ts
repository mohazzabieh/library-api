import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDto } from 'src/user/dtos/user.dto';
import * as crypto from 'crypto';
import { UserService } from 'src/user/user.service';
import { EnvService } from 'src/env/env.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly env: EnvService,
  ) {}
  async validateToken(token: string): Promise<UserDto | undefined> {
    return this.userService.findByToken(token);
  }

  async validateCredential(
    username: string,
    password: string,
  ): Promise<string> {
    const user = await this.userService.findByUsername(username);

    if (user) {
      const passHash = this.hashPassword(password);
      if (passHash === user.password) {
        const token = await this.userService.updateToken(user._id);

        return token;
      }
    }

    throw new UnauthorizedException();
  }

  hashPassword(password: string): string {
    return crypto
      .pbkdf2Sync(password, this.env.salt, 1000, 64, 'sha512')
      .toString('hex');
  }
}
