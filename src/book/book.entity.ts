import { User } from 'src/user/user.entity';
import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity()
export class Book {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  title: string;

  @Column()
  Author: string;

  @Column()
  loaned: boolean;

  @Column()
  loanedDate?: Date;

  @Column()
  loanedBy?: User;

  @Column()
  returnDate?: Date;
}
