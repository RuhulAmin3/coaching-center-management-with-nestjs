import { registerAs } from '@nestjs/config';

export const APP_CONFIG = registerAs('APP', () => {
  return {
    port: process.env.PORT,
    global_prefix: process.env.GLOBAL_PREFIX,
  };
});
