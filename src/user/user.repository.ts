import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository, ObjectID } from 'typeorm';
import { MongoFindOneOptions } from 'typeorm/find-options/mongodb/MongoFindOneOptions';
import { User } from './user.entity';
import { v4 as uuidv4 } from 'uuid';
import { UserDto, UserDtoList } from './dtos/user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepositry: MongoRepository<User>,
  ) {}

  async findByToken(tkn: string): Promise<UserDto | undefined> {
    const options: MongoFindOneOptions<User> = {
      where: {
        token: tkn,
      },
    };
    const user = await this.userRepositry.findOne(options);

    if (user) {
      return {
        _id: user._id.toString(),
        username: user.username,
        role: user.role,
      };
    }
  }

  async findByUsername(usrname: string): Promise<User | undefined> {
    const options: MongoFindOneOptions<User> = {
      where: {
        username: usrname,
      },
    };
    return this.userRepositry.findOne(options);
  }

  async updateToken(_id: ObjectID): Promise<string> {
    const token = uuidv4();

    await this.userRepositry.updateOne(
      {
        _id,
      },
      {
        $set: {
          token,
        },
      },
    );

    return token;
  }

  async getAllUsers(): Promise<UserDtoList> {
    const users = await this.userRepositry.find();

    return {
      users: users.map((u) => ({
        _id: u._id.toString(),
        username: u.username,
        role: u.role,
      })),
    };
  }

  async insertMany(users: any[]): Promise<User[]> {
    await this.userRepositry.insertMany(users);
    return this.userRepositry.find();
  }
}
