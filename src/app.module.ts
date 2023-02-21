import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { EnvModule } from './env/env.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserResolver } from './user/user.resolver';
import { EmailScalar } from './scalars/email.scalar';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EnvService } from './env/env.service';
import { AuthResolver } from './auth/auth.resolver';
import { BookModule } from './book/book.module';
import { DateScalar } from './scalars/date.scalar';
import { BookResolver } from './book/book.resolver';
import { ObjectIdScalar } from './scalars/objectId.scalar';

@Module({
  imports: [
    EnvModule,
    TypeOrmModule.forRootAsync({
      inject: [EnvService],
      useFactory: (env: EnvService) => {
        const options: TypeOrmModuleOptions = {
          ...env.mongoConfig,
          type: 'mongodb',
          useUnifiedTopology: true,
          autoLoadEntities: true,
        };

        return options;
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      resolvers: {
        Email: EmailScalar,
        Date: DateScalar,
        ObjectId: ObjectIdScalar,
      },
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
      playground: true,
      context: ({ req }) => ({ req }),
    }),
    AuthModule,
    UserModule,
    BookModule,
  ],
  providers: [AuthResolver, UserResolver, BookResolver],
})
export class AppModule {}
