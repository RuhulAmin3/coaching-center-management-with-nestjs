import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImageToCloud(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(file.path, (err, result) => {
        fs.unlinkSync(file.path);
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
}
