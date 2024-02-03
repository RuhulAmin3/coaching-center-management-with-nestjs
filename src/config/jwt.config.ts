import { registerAs } from '@nestjs/config';

export const JWT_CONFIG = registerAs('JWT', () => {
  return {
    access_secret: process.env.JWT_ACCESS_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    access_expire_time: process.env.JWT_ACCESS_EXPIRE_TIME,
    refresh_expire_time: process.env.JWT_REFRESH_EXPIRE_TIME,
  };
});
