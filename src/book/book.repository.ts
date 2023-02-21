import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Book } from './book.entity';
import { BookDto, AdminBookDto, BookDtoList } from './dtos/book.dto';
import { ObjectId } from 'mongodb';
import { UserDto } from 'src/graphql';

@Injectable()
export class BookRepository {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepositry: MongoRepository<Book>,
  ) {}

  async getBooksList(adminView: boolean): Promise<BookDtoList> {
    const books = await this.bookRepositry.find();

    return {
      books: books.map((b) => {
        const newBook: BookDto = {
          _id: b._id.toString(),
          title: b.title,
          Author: b.Author,
          loaned: b.loaned,
          loanedDate: b.loanedDate,
          returnDate: b.returnDate,
        };

        if (adminView && b.loanedBy) {
          const adminBook: AdminBookDto = {
            ...newBook,
            loanedBy: {
              _id: b.loanedBy._id.toString(),
              username: b.loanedBy.username,
              role: b.loanedBy.role,
            },
          };

          return adminBook;
        }

        return newBook;
      }),
    };
  }

  async loanBook(
    bookId: ObjectId,
    returnDate: Date,
    user: UserDto,
  ): Promise<boolean> {
    const book = await this.bookRepositry.findOne({
      where: {
        _id: bookId,
      },
    });

    if (book.loaned) {
      throw new Error('Book is already loaned!');
    }

    const now = new Date();

    if (returnDate <= now) {
      throw new Error('Return date must be greater that today');
    }

    await this.bookRepositry.updateOne(
      {
        _id: bookId,
      },
      {
        $set: {
          loaned: true,
          loanedDate: now,
          loanedBy: user,
          returnDate,
        },
      },
    );

    return true;
  }

  async returnBook(bookId: ObjectId, user: UserDto): Promise<boolean> {
    const book = await this.bookRepositry.findOne({
      where: {
        _id: bookId,
      },
    });

    if (!book.loaned) {
      throw new Error('Book is not borrowed!');
    }

    if (book.loanedBy._id.toString() !== user._id) {
      throw new Error('Book has not been borrowed by you!');
    }

    await this.bookRepositry.updateOne(
      {
        _id: bookId,
      },
      {
        $set: {
          loaned: false,
        },
        $unset: {
          loanedDate: '',
          loanedBy: '',
          returnDate: '',
        },
      },
    );

    return true;
  }
}
