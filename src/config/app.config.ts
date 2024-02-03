import { registerAs } from '@nestjs/config';

export const APP_CONFIG = registerAs('APP', () => {
  return {
    port: process.env.PORT || 3000,
    global_prefix: process.env.GLOBAL_PREFIX,
  };
});
