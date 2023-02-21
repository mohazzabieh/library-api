import { UserDto } from 'src/graphql';

export type BookDto = {
  _id?: string;
  title: string;
  Author: string;
  loaned: boolean;
  loanedDate?: Date;
  returnDate?: Date;
};

export type AdminBookDto = BookDto & {
  loanedBy?: UserDto;
};

export class BookDtoList {
  books: BookDto[] | AdminBookDto[];
}
