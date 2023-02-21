import { Injectable } from '@nestjs/common';
import { BookRepository } from './book.repository';
import { BookDtoList } from './dtos/book.dto';
import { UserRole, UserDto } from 'src/user/dtos/user.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class BookService {
  constructor(private readonly bookRepository: BookRepository) {}

  async getBooksList(user: UserDto): Promise<BookDtoList | undefined> {
    return this.bookRepository.getBooksList(user.role === UserRole.Admin);
  }

  async loanBook(
    bookId: ObjectId,
    returnDate: Date,
    user: UserDto,
  ): Promise<boolean> {
    return this.bookRepository.loanBook(bookId, returnDate, user);
  }

  async returnBook(bookId: ObjectId, user: UserDto): Promise<boolean> {
    return this.bookRepository.returnBook(bookId, user);
  }
}
