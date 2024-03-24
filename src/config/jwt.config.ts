import { registerAs } from '@nestjs/config';

export const JWT_CONFIG = registerAs('JWT', () => {
  return {
    jwt_secret: process.env.JWT_SECRET,
    access_expire_time: process.env.JWT_ACCESS_EXPIRE_TIME,
    refresh_expire_time: process.env.JWT_REFRESH_EXPIRE_TIME,
    bcrypt_solt_level: process.env.BCRYPT_SOLT_LEVEL,
  };
});
