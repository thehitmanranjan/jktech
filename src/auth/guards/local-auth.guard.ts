import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    // Add any additional logic for local authentication
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // You can add custom error handling and logging here
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}