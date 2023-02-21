import { UserDto } from '../../user/dtos/user.dto';

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
