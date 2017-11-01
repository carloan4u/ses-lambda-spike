import {S3} from 'aws-sdk';
import {simpleParser} from 'mailparser';

export default class MailRetriever {

  constructor() {
    this.s3 = new S3();
  }

  async getMailForS3Data(s3data) {
    var bucketName = s3data.bucket.name;
    var fileName = s3data.object.key
    var file = await this.s3
      .getObject({ Bucket: bucketName, Key: fileName })
      .promise();
    return await simpleParser(file.Body.toString());
  }
}