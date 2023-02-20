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
      resolvers: { Email: EmailScalar },
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
      playground: true,
      context: ({ req }) => ({ req }),
    }),
    AuthModule,
    UserModule,
  ],
  providers: [UserResolver],
})
export class AppModule {}
