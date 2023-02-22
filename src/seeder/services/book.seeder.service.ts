import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { books } from '../data/books';
import { Book } from 'src/book/book.entity';
import { UserDto } from 'src/user/dtos/user.dto';

@Injectable()
export class BookSeederService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepositry: MongoRepository<Book>,
  ) {}

  async create(users: UserDto[]): Promise<number | any> {
    await this.bookRepositry.deleteMany({});

    for (const book of books) {
      if (book.loaned) {
        const index = Math.round(Math.random() * 2);
        book.loanedBy = users[index];
      }
      await this.bookRepositry.insertOne(book);
    }

    return books.length;
  }
}
