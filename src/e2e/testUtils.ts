import { TestingModule } from '@nestjs/testing';
import { EntityManager, MongoRepository } from 'typeorm';
import * as request from 'supertest';
import { User } from '../user/user.entity';
import { UserRole } from '../user/dtos/user.dto';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../auth/auth.service';
import { INestApplication } from '@nestjs/common';
import { Book } from '../book/book.entity';

export function sendRequest(
  app: INestApplication,
  data: string | object,
): request.Test {
  return request(app.getHttpServer()).post('/graphql').send(data);
}

export async function cleanUsers(module: TestingModule): Promise<void> {
  const manager = module.get(EntityManager);
  const userModel = new MongoRepository<User>(User, manager);

  await userModel.deleteMany({});
}

export async function fillUsers(module: TestingModule): Promise<User[]> {
  const manager = module.get(EntityManager);
  const userModel = new MongoRepository<User>(User, manager);
  const authService = module.get<AuthService>(AuthService);

  await userModel.insertMany([
    {
      username: 'admin@test.com',
      role: UserRole.Admin,
      token: uuidv4(),
      password: authService.hashPassword('admin'),
    },
    {
      username: 'user1@test.com',
      role: UserRole.User,
      token: uuidv4(),
      password: authService.hashPassword('user1'),
    },
    {
      username: 'user2@test.com',
      role: UserRole.User,
      token: uuidv4(),
      password: authService.hashPassword('user2'),
    },
  ]);

  return userModel.find();
}

export async function getUser(
  module: TestingModule,
  username: string,
): Promise<User> {
  const manager = module.get(EntityManager);
  const userModel = new MongoRepository<User>(User, manager);

  return userModel.findOne({
    where: {
      username,
    },
  });
}

export async function cleanBooks(module: TestingModule): Promise<void> {
  const manager = module.get(EntityManager);
  const bookModel = new MongoRepository<Book>(Book, manager);

  await bookModel.deleteMany({});
}

export async function fillBooks(
  module: TestingModule,
  user: User,
): Promise<Book[]> {
  const manager = module.get(EntityManager);
  const bookModel = new MongoRepository<Book>(Book, manager);

  await bookModel.insertMany([
    {
      title: 'The 7 Habits of Highly Effective People',
      loaned: false,
    },
    {
      title: 'The Power of Now',
      loaned: true,
      loanedDate: new Date(),
      returnDate: new Date(),
      loanedBy: {
        _id: user._id,
        username: user.username,
      },
    },
    {
      title: 'Zero to One',
      loaned: false,
    },
  ]);

  return bookModel.find();
}

export async function getBook(
  module: TestingModule,
  title: string,
): Promise<Book> {
  const manager = module.get(EntityManager);
  const bookModel = new MongoRepository<Book>(Book, manager);

  return bookModel.findOne({
    where: {
      title,
    },
  });
}
