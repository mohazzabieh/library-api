import { Injectable } from '@nestjs/common';
import { UserDto, UserRole } from 'src/user/dtos/user.dto';

@Injectable()
export class AuthService {
  async validateToken(token: string): Promise<UserDto> {
    // const user = await this.userServicve.findByToken(token);
    // return user || null;
    console.log(token);

    return {
      username: 'mohammad',
      role: UserRole.Admin,
      id: 'as,jhads',
      token: '1287687162',
    };
  }
}
