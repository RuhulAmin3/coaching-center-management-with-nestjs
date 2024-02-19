import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

export class JsonParseInterceptor implements NestInterceptor {
  constructor(private readonly role: string) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    try {
      const parseData = JSON.parse(req.body[this.role]);
      req.body[this.role] = parseData;
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
    return next.handle();
  }
}
