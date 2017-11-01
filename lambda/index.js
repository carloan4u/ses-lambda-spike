var mssql = require('mssql');
var db_config = require('./config/db.config.js');
var getMailFromS3 = require('./getMailFromS3.js');

const errorHandler = error => console.log(`Error: ${error}`);
const dummyEvent = require('./sample.js');
const dummyCallback = (p, r) => console.log(r);

const subjectConversationIdRegex = /^.*\(#([0-9]+)\).*$/;



if (process.env.DEBUG) {
  processEvent(dummyEvent, dummyCallback);
}

exports.handler = async (event, context, callback) => processEvent(event, callback);

function processEvent(event, callback) {
  getMailFromS3(event.Records[0].s3)
    .then(mail => {
      console.log(JSON.stringify(mail));
      var conversationData = getConversationData(mail);
      if (conversationData.senderEmail === undefined || conversationData.conversationId === undefined) {
        callback(null, `Conversation data flawed: ${conversationData}`);
      }
      console.log(conversationData);
      mssql.connect(db_config)
        .then(pool => {
          return getSenderByEmail(conversationData.senderEmail)
            .then(result => console.log(`Sender exists: ${result}`));
        })
        .then(pool => {
          return checkConversationId(conversationData.conversationId)
            .then(result => {
              if (result) {
                callback(null, 'matched conversation ' + conversationData.conversationId);
              } else {
                callback(null, 'no conversation matched (' + conversationData.conversationId + ')');
              }
            });
        })
        .then(() => mssql.close());
    });
}

function getConversationData(mail) {
  return {
    senderEmail: findSenderId(mail),
    conversationId: getConversationId(mail)
  };
}

function findSenderId(mail) {
  if (mail === undefined || mail.from === undefined || mail.from.value === undefined || mail.from.value.length === 0) {
    return undefined;
  }
  return mail.from.value[0].address;
}

function getConversationId(mail) {
  if (mail === undefined) return undefined;
  var match = subjectConversationIdRegex.exec(mail.subject);
  if (match.length < 2) {
    return undefined;
  }
  return match[1];

}

function checkConversationId(id) {
  return new mssql.Request()
    .input('conversation_id', id)
    .query('select * from conversations where id = @conversation_id')
    .then(result => {
      return result.recordsets.length > 0
    })
    .catch(errorHandler);
}

function getSenderByEmail(email) {
  return new mssql.Request()
    .input('email_address', email)
    .query('select TOP 1 * from dealers where EmailAddress = @email_address')
    .then(result => {
      console.log(JSON.stringify(result.recordsets));
      return result.recordsets.length > 0
    })
    .catch(errorHandler);
}