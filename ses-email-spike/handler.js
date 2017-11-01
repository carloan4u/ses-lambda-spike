import MailRetriever from './js/mail-retriever';
import MailParser from './js/mail-parser';
import ConversationDb from './js/conversation-db';

import sql from 'mssql';
import dbConfig from './config/db.config';

const conversationDb = new ConversationDb();

export const hello = async (event, context, callback) => {

  var mail = await new MailRetriever().getMailForS3Data(event.Records[0].s3);
  var conversationData = await new MailParser().parse(mail);
  var sender = await conversationDb.getSenderIdByEmail(conversationData.SenderEmail);
  conversationDb.close();
  callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!' });
};

function _connect() {
  
}