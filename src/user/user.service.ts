import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { ObjectID } from 'typeorm';
import { UserDto, UserDtoList } from './dtos/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findByUsername(username);
  }

  async findByToken(token: string): Promise<UserDto | undefined> {
    return this.userRepository.findByToken(token);
  }

  async updateToken(_id: ObjectID): Promise<string> {
    return this.userRepository.updateToken(_id);
  }

  async getAllUsers(): Promise<UserDtoList> {
    return this.userRepository.getAllUsers();
  }
}
