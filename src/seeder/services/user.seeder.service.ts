import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from '../../user/user.entity';
import { users, IUSer } from '../data/users';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserSeederService {
  constructor(
    @InjectRepository(User)
    private readonly userRepositry: MongoRepository<User>,
    private readonly authService: AuthService,
  ) {}

  async create(): Promise<number | any> {
    await this.userRepositry.deleteMany({});

    for (const user of users) {
      const password = this.authService.hashPassword(user.password);
      await this.userRepositry.insertOne({
        ...user,
        password,
      });
    }

    return users.length;
  }
}
