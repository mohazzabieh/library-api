export enum UserRole {
  Admin = 'Admin',
  User = 'User',
}

export interface UserDto {
  _id: string;
  username: string;
  role: UserRole;
}

export class UserDtoList {
  users: UserDto[];
}
