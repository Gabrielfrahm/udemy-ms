import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsService {
  private logger = new Logger(AwsService.name);
  constructor(private configService: ConfigService) {
    this.configService = configService;
  }
  public async fileUpload(file: any, id: string) {
    const AWS_S3_BUCKER_NAME =
      this.configService.get<string>('AWS_S3_BUCKER_NAME');
    const AWS_REGION = this.configService.get<string>('AWS_REGION');
    const AWS_ACCESS_KEY_ID =
      this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const AWS_SECRET_ACCESS_KEY = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    );

    const s3 = new AWS.S3({
      region: AWS_REGION,
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    });

    const fileExtension = file.originalname.split('.')[1];

    const urlKey = `${id}.${fileExtension}`;

    this.logger.log(urlKey);

    const params = {
      Body: file.buffer,
      Bucket: AWS_S3_BUCKER_NAME,
      Key: urlKey,
    };

    const data = s3
      .putObject(params)
      .promise()
      .then(
        (data) => {
          return {
            url: `https://${AWS_S3_BUCKER_NAME}.s3.amazonaws.com/${urlKey}`,
          };
        },
        (err) => {
          this.logger.log(err);
          return err;
        },
      );

    return data;
  }
}
