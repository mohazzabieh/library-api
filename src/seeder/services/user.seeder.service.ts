import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from '../../user/user.entity';
import { users } from '../data/users';
import { UserDto } from 'src/user/dtos/user.dto';

@Injectable()
export class UserSeederService {
  constructor(
    @InjectRepository(User)
    private readonly userRepositry: MongoRepository<User>,
  ) {}

  create(): Array<Promise<User>> {
    return users.map(async (user: UserDto) => {
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
          return Promise.resolve(await this.userRepositry.insertOne(user));
        })
        .catch((error) => Promise.reject(error));
    });
  }
}
