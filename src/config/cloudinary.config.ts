import { registerAs } from '@nestjs/config';

export const CLOUDINARY_CONFIG = registerAs('CLOUDINARY', () => {
  return {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  };
});
