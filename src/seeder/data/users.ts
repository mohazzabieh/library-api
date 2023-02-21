import { UserRole } from 'src/user/dtos/user.dto';

export interface IUSer {
  username: string;
  password: string;
  role: UserRole;
}

export const users: IUSer[] = [
  {
    username: 'admin@demo.com',
    role: UserRole.Admin,
    password: 'admin',
  },
  {
    username: 'user1@demo.com',
    role: UserRole.User,
    password: 'user1',
  },
  {
    username: 'user2@demo.com',
    role: UserRole.User,
    password: 'user2',
  },
];
