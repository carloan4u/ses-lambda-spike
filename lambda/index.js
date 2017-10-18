var mssql = require('mssql');
var db_config = require('./config/db.config.js');

//const x = getConversationId({ Records: [{ ses: { mail: { destination: ["1@poweredbytim.co.uk"] } } }] });
//checkConversationId(x)
//  .then(result => {
//    process.exit();
//  });

exports.handler = (event, context, callback) => {
  var matchedDestination = getConversationId(event);
  if(matchedDestination === undefined) {
    callback(null, 'no conversation id found');
  }
  checkConversationId(matchedDestination)
    .then(result => {
      if(result) {
        callback(null, 'matched conversation ' + matchedDestination);
      } else {
        callback(null, 'no conversation matched (' + matchedDestination + ')');
      }
    });
};

function getConversationId(event) {
  if (event === undefined || event.Records === undefined || event.Records.length === 0) {
    return undefined;
  }
  var destinations = event.Records[0].ses.mail.destination;
  var matchedDestination;
  for (var i = 0; i < destinations.length; i++) {
    var parts = destinations[i].split('@');
    if (parts[1] == 'poweredbytim.co.uk') {
      return parts[0];
    }
  }
}

function checkConversationId(id) {
  return mssql
      .connect(db_config)
      .then(pool => {
        return pool
          .request()
          .input('conversation_id', id)
          .query('select * from conversations where id = @conversation_id')
          .then(result => {
              pool.close();
              return result.recordsets.length > 0
          });
      });
}