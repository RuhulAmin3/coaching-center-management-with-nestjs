import { Global, Module } from '@nestjs/common';
import { ApiResponseModule } from './api-response/api-response.module';

@Global()
@Module({
  imports: [ApiResponseModule],
})
export class SharedModule {}
