import { registerAs } from '@nestjs/config';

export const DATABASE_CONFIG = registerAs('DATABASE', () => {
  return {
    database_url: process.env.DATABASE_URL,
  };
});
