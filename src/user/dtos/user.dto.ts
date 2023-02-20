export enum UserRole {
  Admin,
  User,
}

export interface UserDto {
  id?: string;
  username: string;
  token: string;
  role: UserRole;
}
