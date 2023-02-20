
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface IQuery {
    users(): Nullable<string> | Promise<Nullable<string>>;
}

export interface IMutation {
    login(username: Email, password: string): string | Promise<string>;
}

export type Email = any;
type Nullable<T> = T | null;
