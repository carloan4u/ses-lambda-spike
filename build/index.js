var mssql = require('mssql');
var db_config = require('./config/db.config.js');
var getMailFromS3 = require('./getMailFromS3.js');

const errorHandler = error => console.log(`Error: ${error}`);

//const x = getConversationId({ Records: [{ ses: { mail: { destination: ["1@poweredbytim.co.uk"] } } }] });
//checkConversationId(x)
//  .then(result => {
//    process.exit();
//  });

exports.handler = (event, context, callback) => {
  console.log(JSON.stringify(event));
  getMailFromS3(event.Records[0].s3)
    .then(mail => {
      console.log(JSON.stringify(mail));
      var matchedDestination = getConversationId(mail);
      if (matchedDestination === undefined) {
        callback(null, 'no conversation id found');
      }
      console.log(matchedDestination);
      checkConversationId(matchedDestination)
        .then(result => {
          if (result) {
            callback(null, 'matched conversation ' + matchedDestination);
          } else {
            callback(null, 'no conversation matched (' + matchedDestination + ')');
          }
        });
    });
  
};

function getConversationId(mail) {
  if (mail === undefined || mail.to === undefined || mail.to.value === undefined || mail.to.value.length === 0) {
    return undefined;
  }
  var destinations = mail.to.value;
  var matchedDestination;
  for (var i = 0; i < destinations.length; i++) {
    var parts = destinations[i].address.split('@');
    if (parts[1] == 'poweredbytim.co.uk') {
      return parts[0];
    }
  }
}

function checkConversationId(id) {
  return mssql
    .connect(db_config)
    .then(pool => {
      console.log('here');
      return pool
        .request()
        .input('conversation_id', id)
        .query('select * from conversations where id = @conversation_id')
        .then(result => {
          pool.close();
          return result.recordsets.length > 0
        })
        .catch(errorHandler);
    })
    .catch(errorHandler);
}