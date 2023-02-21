import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';
import { UserRole } from './dtos/user.dto';

@Entity()
export class User {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  token: string;

  @Column()
  role: UserRole;
}
