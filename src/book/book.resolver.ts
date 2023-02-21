import { UseGuards } from '@nestjs/common';
import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import { BearerGuard } from 'src/auth/bearer.guard';
import { BookService } from './book.service';
import { User } from 'src/decorators/user.decorator';
import { BookDtoList } from './dtos/book.dto';
import { ObjectId } from 'mongodb';

@UseGuards(BearerGuard)
@Resolver()
export class BookResolver {
  constructor(private readonly bookService: BookService) {}

  @Query(() => BookDtoList)
  async booksList(@User() user): Promise<BookDtoList> {
    return this.bookService.getBooksList(user);
  }

  @Mutation(() => Boolean)
  async loanBook(
    @Args('bookId') bookId: ObjectId,
    @Args('returnDate') returnDate: Date,
    @User() user,
  ): Promise<boolean> {
    return this.bookService.loanBook(bookId, returnDate, user);
  }

  @Mutation(() => Boolean)
  async returnBook(
    @Args('bookId') bookId: ObjectId,
    @User() user,
  ): Promise<boolean> {
    return this.bookService.returnBook(bookId, user);
  }
}
