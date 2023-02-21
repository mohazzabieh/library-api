import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { books } from '../data/books';
import { Book } from 'src/book/book.entity';
import { UserDto } from 'src/graphql';

@Injectable()
export class BookSeederService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepositry: MongoRepository<Book>,
  ) {}

  create(users: UserDto[]): Array<Promise<Book>> {
    return books.map(async (book) => {
      return await this.bookRepositry
        .findOne({
          where: {
            title: book.title,
          },
        })
        .then(async (dbBook) => {
          // Check if a book already exists.
          // If it does don't create a new one.
          if (dbBook) {
            return Promise.resolve(null);
          }

          if (book.loaned) {
            const index = Math.round(Math.random() * 2);
            book.loanedBy = users[index];
          }

          return Promise.resolve(await this.bookRepositry.insertOne(book));
        })
        .catch((error) => Promise.reject(error));
    });
  }
}
