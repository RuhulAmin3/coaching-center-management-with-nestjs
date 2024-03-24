import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Reflector } from '@nestjs/core';
import { PUBLIC_KEY } from '../auth.constant';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  jwtFromRequestFn = ExtractJwt.fromAuthHeaderAsBearerToken();
  constructor(private readonly reflector: Reflector) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<any> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;
    const request = context.switchToHttp().getRequest();
    const token = this.jwtFromRequestFn(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    return await super.canActivate(context);
  }
  handleRequest(err, user) {
    if (err || !user) throw new UnauthorizedException();
    return user;
  }
}
