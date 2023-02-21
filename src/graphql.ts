
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface IMutation {
    login(username: Email, password: string): string | Promise<string>;
    loanBook(bookId: ObjectId, returnDate: Date): Nullable<boolean> | Promise<Nullable<boolean>>;
    returnBook(bookId: ObjectId): Nullable<boolean> | Promise<Nullable<boolean>>;
}

export interface BookDto {
    _id: ObjectId;
    title: string;
    Author: string;
    loaned: boolean;
    loanedDate?: Nullable<Date>;
    returnDate?: Nullable<Date>;
    loanedBy?: Nullable<UserDto>;
}

export interface BookDtoList {
    books?: Nullable<Nullable<BookDto>[]>;
}

export interface IQuery {
    booksList(): Nullable<BookDtoList> | Promise<Nullable<BookDtoList>>;
    usersList(): Nullable<UserDtoList> | Promise<Nullable<UserDtoList>>;
}

export interface UserDto {
    _id: string;
    username: string;
    role: string;
}

export interface UserDtoList {
    users?: Nullable<Nullable<UserDto>[]>;
}

export type Email = any;
export type ObjectId = any;
type Nullable<T> = T | null;
