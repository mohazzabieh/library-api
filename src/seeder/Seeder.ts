import { Injectable } from '@nestjs/common';
import { UserSeederService } from './services/user.seeder.service';
import { BookSeederService } from './services/book.seeder.service';
import { UserService } from 'src/user/user.service';
import { UserDtoList } from 'src/user/dtos/user.dto';

@Injectable()
export class Seeder {
  constructor(
    private readonly userSeederService: UserSeederService,
    private readonly bookSeederService: BookSeederService,
    private readonly userService: UserService,
  ) {}
  async seed() {
    let usersList: UserDtoList;

    await this.users()
      .then(async (completed) => {
        console.log('Successfuly completed seeding users...');
        Promise.resolve(completed);

        usersList = await this.userService.getAllUsers();
      })
      .catch((error) => {
        console.error('Failed seeding users...');
        Promise.reject(error);
      });

    if (usersList) {
      await this.books(usersList)
        .then((completed) => {
          console.log('Successfuly completed seeding books...');
          Promise.resolve(completed);
        })
        .catch((error) => {
          console.error('Failed seeding books...');
          Promise.reject(error);
        });
    }
  }
  async users() {
    try {
      const createdUsers = await this.userSeederService.create();
      console.log(`No. of users created : ${createdUsers}`);

      return true;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async books(usersList: UserDtoList) {
    try {
      const createdBooks = await this.bookSeederService.create(usersList.users);
      console.log(`No. of books created: ${createdBooks}`);

      return true;
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
