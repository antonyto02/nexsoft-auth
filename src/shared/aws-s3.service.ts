import {
  S3Client,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class AwsS3Service {
  private s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  async generateUploadUrl(type: string, ext: string) {
    const fileName = `logos/temp_upload_url_${Date.now()}.${ext}`;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      ContentType: `image/${ext}`,
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 }); // 1h

    return {
      upload_url: url,
      key: fileName,
    };
  }
}
