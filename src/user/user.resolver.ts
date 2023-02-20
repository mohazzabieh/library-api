import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';

@Resolver()
export class UserResolver {
  @Query(() => String)
  async users() {
    return 'hiii';
  }

  @Mutation(() => String)
  async login(
    @Args('username') username: string,
    @Args('password') password: string,
  ) {
    return `Hello, ${username}: ${password}`;
  }
}
