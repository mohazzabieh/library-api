import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { MongoFindOneOptions } from 'typeorm/find-options/mongodb/MongoFindOneOptions';
import { User } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepositry: MongoRepository<User>,
  ) {}

  async findByToken(token: string): Promise<User | undefined> {
    const options: MongoFindOneOptions<User> = {
      where: {
        token,
      },
    };
    return this.userRepositry.findOne(options);
  }
}
