import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../user/dtos/user.dto';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const role = this.reflector.get<UserRole>('role', ctx.getHandler());

    if (!role) {
      return true;
    }

    const { req } = ctx.getContext();
    const { user } = req;

    return user && user.role === role;
  }
}
