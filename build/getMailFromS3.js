var AWS = require('aws-sdk');
var mailparser = require('mailparser');
const simpleParser = mailparser.simpleParser;

module.exports = function getMailFromS3(s3) {
  var bucketName = s3.bucket.name;
  var fileName = s3.object.key
  return new AWS.S3()
    .getObject({ Bucket: bucketName, Key: fileName })
    .promise()
    .then(data => {
      console.log(data.Body.toString());
      return simpleParser(data.Body.toString())
        .then(mail => mail)
        .catch(error => console.log(`Error: ${error}`))
    })
    .catch(err => {
      console.log(`Error: ${err}`);
    });
}