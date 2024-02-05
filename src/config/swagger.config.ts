import { registerAs } from '@nestjs/config';

export const SWAGGER_CONFIG = registerAs('SWAGGER', () => {
  return {
    path: process.env.API_PATH,
    enable: process.env.ENABLE,
    version: process.env.VERSION,
  };
});
