import ConversationDb from '../shared/js/conversation-db';
import generateHash from './js/conversation-hash-generator';
import sendEmail from '../shared/js/email-sender';

import sql from 'mssql';

const conversationDb = new ConversationDb();

export const hello = async (event, context, callback) => {

  var conversation = await _createConversation(event.yourEmail, event.theirEmail);
  await conversationDb.saveNewMessage(conversation.conversationId, conversation.customerId, null, event.message);
  sendEmail(event.theirEmail, conversation.conversationId, event.message);

  conversationDb.close();
  callback(null, { conversationId: conversation.conversationId });
};

async function _createConversation(customerEmail, dealerEmail) {
  var conversationId = generateHash(customerEmail, dealerEmail); 
  var customerId = await _getOrCreateCustomer(customerEmail);
  console.log(`Customer: ${customerId}`);
  var dealerId = await _getOrCreateDealer(dealerEmail);
  console.log(`Dealer: ${dealerId}`);
  await conversationDb.saveNewConversation(conversationId, customerId, dealerId);
  return {
    customerId,
    dealerId,
    conversationId
  };
}

async function _getOrCreateCustomer(emailAddress) {
  let customerId;
  var customerQueryResult = await conversationDb.getCustomerByEmail(emailAddress);

  if(customerQueryResult.recordset.length == 0) {
    customerId = await conversationDb.saveNewCustomer(emailAddress, 'customer1');
  } else {
    customerId = customerQueryResult.recordset[0].Id;
  }

  return customerId;
}

async function _getOrCreateDealer(emailAddress) {
  let dealerId;
  var dealerQueryResult = await conversationDb.getDealerIdByEmail(emailAddress);
  
  if(dealerQueryResult.recordset.length == 0) {
    dealerId = await conversationDb.saveNewDealer(emailAddress, 'dealer1');
  } else {
    dealerId = dealerQueryResult.recordset[0].Id;
  }

  return dealerId;
}