import MailRetriever from './js/mail-retriever';
import MailParser from './js/mail-parser';
import ConversationDb from '../shared/js/conversation-db';

const conversationDb = new ConversationDb();

export const hello = async (event, context, callback) => {
  console.log("hello");
  var mail = await new MailRetriever().getMailForS3Data(event.Records[0].s3);
  console.log(mail);
  var conversationData = await new MailParser().parse(mail);
  console.log(conversationData);
  var dealerId = await getDealerIdByEmail(conversationData.SenderEmail);
  await parseAndAddReply(mail.text, conversationData, dealerId);
  conversationDb.close();
  callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!' });
};

async function getDealerIdByEmail(emailAddress) {
  var dealerResult = await conversationDb.getDealerIdByEmail(emailAddress);

  if(dealerResult.recordset.length == 0) {
    return null;
  }
  return dealerResult.recordset[0].Id
}

async function parseAndAddReply(mailText, conversation, dealerId) {
  var parsedMessage = "reply";
  await conversationDb.saveNewMessage(conversation.ConversationId,null,dealerId,parsedMessage);
}