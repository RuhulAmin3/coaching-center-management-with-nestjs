import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/decorator/public.decorator';
import { SeederService } from './seeder.service';

@Controller('/seed')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}
  @Get()
  @Public()
  async executeSeedRoute() {
    await this.seederService.seed();
  }
}
