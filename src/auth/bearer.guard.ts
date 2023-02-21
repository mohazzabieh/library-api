import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class BearerGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    if (req.headers && req.headers.authorization) {
      const token = req.headers.authorization.replace(/Bearer /i, '');

      const user = await this.authService.validateToken(token);

      if (user) {
        req.user = user;
        return true;
      }
    }

    throw new UnauthorizedException();
  }
}
