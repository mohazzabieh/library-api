import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import { User } from '../user/user.entity';
import { UserRole } from '../user/dtos/user.dto';
import * as TestUtils from './testUtils';
import { Book } from '../book/book.entity';
import { ConfigModule } from '@nestjs/config';
import { EnvService } from '../env/env.service';

describe('GraphQL E2E Test', () => {
  let module: TestingModule;
  let app: INestApplication;
  let dbUsers: User[];
  let dbBooks: Book[];

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    await TestUtils.cleanBooks(module);
    await TestUtils.cleanUsers(module);

    dbUsers = await TestUtils.fillUsers(module);
    dbBooks = await TestUtils.fillBooks(module, dbUsers[1]);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth Resolver', () => {
    it('Username must be a valid Email address', () => {
      return TestUtils.sendRequest(app, {
        query: `
            mutation {
              login(username:"user",password:"user")
            }
            `,
      })
        .expect(400)
        .expect(({ body: { errors, data } }) => {
          expect(errors[0].message).toContain(
            'Expected value of type "Email!"',
          );
          expect(data).toBeUndefined();
        });
    });

    it('User must be Unauthorized error on wrong credential', () => {
      const user = dbUsers.find((u) => u.role === UserRole.User);

      return TestUtils.sendRequest(app, {
        query: `
          mutation {
            login(username:"${user.username}",password:"0000")
          }`,
      })
        .expect(200)
        .expect(({ body: { errors, data } }) => {
          expect(errors[0].message).toBe('Unauthorized');
          expect(data).toBeNull();
        });
    });

    it('User must be get token after login', () => {
      const user = dbUsers.find((u) => u.username === 'user2@test.com');

      return TestUtils.sendRequest(app, {
        query: `
            mutation {
              login(username:"${user.username}",password:"user2")
            }
            `,
      })
        .expect(200)
        .expect(
          async ({
            body: {
              data: { login },
            },
          }) => {
            const dbUser = await TestUtils.getUser(module, user.username);
            expect(login).toBe(dbUser.token);
          },
        );
    });
  });

  describe('User Resolver', () => {
    it('Admin should see the list of users', () => {
      const adminUser = dbUsers.find((u) => u.role === UserRole.Admin);

      return TestUtils.sendRequest(app, {
        query: `
          {
            usersList {
              users {
                username
                role
              }
            }
          }`,
      })
        .set('Authorization', `bearer ${adminUser.token}`)
        .expect(200)
        .expect((res) => {
          const { users } = res.body.data.usersList;
          expect(users).toHaveLength(3);
          expect(users[0].role).toEqual(UserRole.Admin);
          expect(users[1].role).toEqual(UserRole.User);
          expect(users[2].role).toEqual(UserRole.User);
        });
    });

    it('User must be getting error on fetching list of users', () => {
      const normalUser = dbUsers.find((u) => u.username === 'user1@test.com');

      return TestUtils.sendRequest(app, {
        query: `
          {
            usersList {
              users {
                username
              }
            }
          }`,
      })
        .set('Authorization', `bearer ${normalUser.token}`)
        .expect(200)
        .expect(
          ({
            body: {
              errors,
              data: { usersList },
            },
          }) => {
            expect(errors[0].message).toBe('Forbidden resource');
            expect(usersList).toBeNull();
          },
        );
    });
  });

  describe('Book Resolver', () => {
    it('Admin should see the list of books with user who borrowed', () => {
      const adminUser = dbUsers.find((u) => u.role === UserRole.Admin);

      return TestUtils.sendRequest(app, {
        query: `
          {
            booksList {
              books {
                title
                loaned
                loanedBy {
                  username
                }
              }
            }
          }`,
      })
        .set('Authorization', `bearer ${adminUser.token}`)
        .expect(200)
        .expect((res) => {
          const { books } = res.body.data.booksList;
          expect(books).toHaveLength(3);
          expect(books[1].loanedBy).not.toBeNull();
          expect(books[1].loanedBy.username).toBe(dbUsers[1].username);
        });
    });

    it('User should see the list of books without user who borrowed', () => {
      const normalUser = dbUsers.find((u) => u.username === 'user1@test.com');

      return TestUtils.sendRequest(app, {
        query: `
          {
            booksList {
              books {
                title
                loaned
                loanedBy {
                  username
                }
              }
            }
          }`,
      })
        .set('Authorization', `bearer ${normalUser.token}`)
        .expect(200)
        .expect((res) => {
          const { books } = res.body.data.booksList;
          expect(books).toHaveLength(3);
          expect(books[1].loaned).toBeTruthy();
          expect(books[1].loanedBy).toBeNull();
        });
    });

    it('Should raise error on laoning borrowed book', () => {
      const book = dbBooks[1];
      const normalUser = dbUsers.find((u) => u.username === 'user1@test.com');

      return TestUtils.sendRequest(app, {
        query: `
            mutation {
              loanBook(bookId: "${book._id.toString()}", returnDate: ${new Date().getTime()})
            }
            `,
      })
        .set('Authorization', `bearer ${normalUser.token}`)
        .expect(200)
        .expect(
          ({
            body: {
              errors,
              data: { loanBook },
            },
          }) => {
            expect(errors[0].message).toBe('Book is already loaned!');
            expect(loanBook).toBeNull();
          },
        );
    });

    it('Should raise error by returnDate less than or equal now', () => {
      const book = dbBooks[2];
      const normalUser = dbUsers.find((u) => u.username === 'user1@test.com');

      return TestUtils.sendRequest(app, {
        query: `
            mutation {
              loanBook(bookId: "${book._id.toString()}", returnDate: ${new Date().getTime()})
            }
            `,
      })
        .set('Authorization', `bearer ${normalUser.token}`)
        .expect(200)
        .expect(
          ({
            body: {
              errors,
              data: { loanBook },
            },
          }) => {
            expect(errors[0].message).toBe(
              'Return date must be greater that today',
            );
            expect(loanBook).toBeNull();
          },
        );
    });

    it('User must be able to borrow book', () => {
      const book = dbBooks[2];
      const normalUser = dbUsers.find((u) => u.username === 'user1@test.com');

      return TestUtils.sendRequest(app, {
        query: `
            mutation {
              loanBook(bookId: "${book._id.toString()}", returnDate: ${
          new Date().getTime() + 1000000
        }
          )
            }
            `,
      })
        .set('Authorization', `bearer ${normalUser.token}`)
        .expect(200)
        .expect(
          async ({
            body: {
              data: { loanBook },
            },
          }) => {
            expect(loanBook).toBeTruthy();
            const dbBook = await TestUtils.getBook(module, book.title);
            expect(dbBook.loaned).toBeTruthy();
            expect(dbBook.loanedBy.username).toBe(normalUser.username);
            expect(dbBook.loanedDate).toBeDefined();
            expect(dbBook.returnDate).toBeDefined();
          },
        );
    });

    it('Only borrowed books can be returen', () => {
      const book = dbBooks[0];
      const adminUser = dbUsers.find((u) => u.role === UserRole.Admin);

      return TestUtils.sendRequest(app, {
        query: `
            mutation {
              returnBook(bookId: "${book._id.toString()}")
            }
            `,
      })
        .set('Authorization', `bearer ${adminUser.token}`)
        .expect(200)
        .expect(
          async ({
            body: {
              errors,
              data: { returnBook },
            },
          }) => {
            expect(errors[0].message).toBe('Book is not borrowed!');
            expect(returnBook).toBeNull();
          },
        );
    });

    it('Only borrower is able to return the book', () => {
      const book = dbBooks[1];
      const adminUser = dbUsers.find((u) => u.role === UserRole.Admin);

      return TestUtils.sendRequest(app, {
        query: `
            mutation {
              returnBook(bookId: "${book._id.toString()}")
            }
            `,
      })
        .set('Authorization', `bearer ${adminUser.token}`)
        .expect(200)
        .expect(
          async ({
            body: {
              errors,
              data: { returnBook },
            },
          }) => {
            expect(errors[0].message).toBe(
              'Book has not been borrowed by you!',
            );
            expect(returnBook).toBeNull();
          },
        );
    });

    it('user must be able to return the book', () => {
      const book = dbBooks[1];
      const adminUser = dbUsers[1];

      return TestUtils.sendRequest(app, {
        query: `
            mutation {
              returnBook(bookId: "${book._id.toString()}")
            }
            `,
      })
        .set('Authorization', `bearer ${adminUser.token}`)
        .expect(200)
        .expect(
          async ({
            body: {
              data: { returnBook },
            },
          }) => {
            expect(returnBook).toBeTruthy();
            const dbBook = await TestUtils.getBook(module, book.title);
            expect(dbBook.loaned).toBeFalsy();
            expect(dbBook.loanedBy).toBeUndefined();
            expect(dbBook.loanedDate).toBeUndefined();
          },
        );
    });
  });

  describe('Env Service', () => {
    let service: EnvService;
    beforeEach(async () => {
      const configs = (): Record<string, any> => ({
        port: 770,
        mongo: {
          url: 'mongoUrl',
          db: 'test-db',
        },
      });

      const envModule: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            load: [configs],
          }),
        ],
        providers: [EnvService],
      }).compile();

      service = envModule.get<EnvService>(EnvService);
    });

    it('should be return config values', () => {
      expect(service.port).toBe(770);
      expect(service.mongoConfig).toBeDefined();
      expect(service.mongoConfig.url).toBe('mongoUrl');
      expect(service.mongoConfig.database).toBe('test-db');
    });
  });
});
