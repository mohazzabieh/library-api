import { Injectable } from '@nestjs/common';
import { UserSeederService } from './services/user.seeder.service';

@Injectable()
export class Seeder {
  constructor(private readonly userSeederService: UserSeederService) {}
  async seed() {
    await this.users()
      .then((completed) => {
        console.log('Successfuly completed seeding users...');
        Promise.resolve(completed);
      })
      .catch((error) => {
        console.error('Failed seeding users...');
        Promise.reject(error);
      });
  }
  async users() {
    return await Promise.all(this.userSeederService.create())
      .then((createdUsers) => {
        console.log(
          'No. of users created : ' +
            createdUsers.filter(
              (nullValueOrCreatedUser) => nullValueOrCreatedUser,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch((error) => Promise.reject(error));
  }
}
