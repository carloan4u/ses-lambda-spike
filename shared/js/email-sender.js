import {SES} from 'aws-sdk';

export default (to, hash, message) => {
  var params = buildParams(to, hash, message);
  new SES().sendEmail(params, (err, data) => {
    console.log(`Err: ${err}`);
    console.log(`Data: ${data}`);
  });
};

function buildParams(to, hash, message) {
  return {
    Destination: {
      ToAddresses: [to]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<p>${message}</p>`
        }, 
        Text: {
          Charset: "UTF-8",
          Data: message
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: `[#${hash}] Z customer says...`
      }
    },
    ReplyToAddresses: [ "aws@poweredbytim.co.uk" ],
    Source: "aws@poweredbytim.co.uk"
  };
}