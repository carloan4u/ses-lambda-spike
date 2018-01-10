import sql from 'mssql';
import dbConfig from './config/db.config';

export default class ConversationDb {

  constructor() {
    this.isConnected = false;
    this.connectionLock = false;
  }

  _connect() {
    return new Promise(function (resolve, reject) {
      sql.connect(dbConfig)
        .then(pool => {
          resolve(pool);
        })
        .catch(err => reject(err));
    });
  }

  async _connectAsync() {
    try {
      while (this.connectionLock) {}
      if (this.isConnected) return;
      this.connectionLock = true;
      this.db = await this._connect();
      this.isConnected = true;
      this.connectionLock = false;
    } catch (err) {
      console.log(err);
    }
  }

  async getDealerIdByEmail(email) {
    if (!this.isConnected) await this._connectAsync();

    return await this.db.request()
      .input('email_address', email)
      .query('select TOP 1 * from dealers where EmailAddress = @email_address');
  }

  async saveNewDealer(email, dealerName, contactName) {
    if (!this.isConnected) await this._connectAsync();

    var result = await this.db.request()
      .input('email_address', email)
      .input('dealer_name', dealerName)
      .input('contact_name', contactName)
      .output('dealer_id', sql.Int)
      .query('insert into dealers(DealerName, ContactName, EmailAddress) VALUES(@dealer_name, @contact_name, @email_address); SELECT @@IDENTITY as dealer_id');

    return result.recordset[0].dealer_id;
  }

  async saveNewConversation(hash, customerId, dealerId) {
    if (!this.isConnected) await this._connectAsync();

    return await this.db.request()
      .input('hash', hash)
      .input('customer_id', customerId)
      .input('dealer_id', dealerId)
      .query('insert into conversations(Hash, CustomerId, DealerId) VALUES(@hash,@customer_id,@dealer_id)');
  }

  async getCustomerByEmail(email) {
    if (!this.isConnected) await this._connectAsync();

    return await this.db.request()
      .input('email_address', email)
      .query('select TOP 1 * from customers where EmailAddress = @email_address');
  }

  async saveNewCustomer(email, name) {
    if (!this.isConnected) await this._connectAsync();

    var result = await this.db.request()
      .input('email_address', email)
      .input('name', name)
      .output('customer_id', sql.Int)
      .query('insert into customers(Name, EmailAddress) VALUES(@name,@email_address); SELECT @@IDENTITY as customer_id');

    return result.recordset[0].customer_id;
  }

  async saveNewMessage(conversationHash, customerId, dealerId, message) {
    if (!this.isConnected) await this._connectAsync();

    return await this.db.request()
      .input('conversation_hash', conversationHash)
      .input('customer_id', customerId)
      .input('dealer_id', dealerId)
      .input('message', message)
      .input('timestamp', new Date())
      .query('insert into messages(ConversationHash, CustomerId, DealerId, Message, Timestamp) VALUES(@conversation_hash,@customer_id,@dealer_id,@message, @timestamp)');
  }

  close() {
    this.db.close();
    this.isConnected = false;
  }

}