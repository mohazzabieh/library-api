import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { BearerGuard } from '../auth/bearer.guard';
import { RoleGuard } from '../auth/role.guard';
import { Role } from '../decorators/role.decorator';
import { UserDtoList } from './dtos/user.dto';
import { UserService } from './user.service';

@UseGuards(BearerGuard)
@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Role('Admin')
  @UseGuards(RoleGuard)
  @Query(() => UserDtoList)
  async usersList(): Promise<UserDtoList> {
    return this.userService.getAllUsers();
  }
}
