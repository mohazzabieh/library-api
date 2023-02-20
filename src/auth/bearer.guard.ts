import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class BearerGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    //     if (err || !user) {
    //       throw new UnauthorizedException();
    //     }

    req.user = {
      username: 'jhgjkgjgh',
      //role: UserRole.Admin,
      id: 'as,jhads',
      token: '1287687162',
    };

    return true;
  }
}
