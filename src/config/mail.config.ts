import { registerAs } from '@nestjs/config';

export const MAIL_CONFIG = registerAs('MAIL', () => {
  return {
    MAIL_PASS: process.env.MAIL_PASS,
    MAIL_USER: process.env.MAIL_USER,
    HOST: process.env.HOST,
    PORT: process.env.MAIL_PORT,
  };
});
