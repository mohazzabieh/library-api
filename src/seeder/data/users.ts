import { UserDto, UserRole } from 'src/user/dtos/user.dto';

export const users: UserDto[] = [
  {
    username: 'admin',
    role: UserRole.Admin,
    token: 'asdfasd',
  },
];
