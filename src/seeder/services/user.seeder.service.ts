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

  create(): Array<Promise<User>> {
    return users.map(async (user: IUSer) => {
      return await this.userRepositry
        .findOne({
          where: {
            username: user.username,
          },
        })
        .then(async (dbUser) => {
          // Check if a user already exists.
          // If it does don't create a new one.
          if (dbUser) {
            return Promise.resolve(null);
          }

          const password = this.authService.hashPassword(user.password);

          return Promise.resolve(
            await this.userRepositry.insertOne({
              ...user,
              password,
            }),
          );
        })
        .catch((error) => Promise.reject(error));
    });
  }
}
