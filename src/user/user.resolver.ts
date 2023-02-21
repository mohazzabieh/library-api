import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { BearerGuard } from 'src/auth/bearer.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { Role } from 'src/decorators/role.decorator';
import { UserDtoList } from './dtos/user.dto';
import { UserService } from './user.service';

@UseGuards(BearerGuard)
@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Role('Admin')
  @UseGuards(RoleGuard)
  @Query(() => UserDtoList)
  async allUsers(): Promise<UserDtoList> {
    return this.userService.getAllUsers();
  }
}
