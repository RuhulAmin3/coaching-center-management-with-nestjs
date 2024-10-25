import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './modules/auth/decorator/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  @Public()
  RootRoute() {
    return 'Server running success on port 4000';
  }
}
