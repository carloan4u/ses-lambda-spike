import sql from 'mssql';
import dbConfig from '../config/db.config';

export default class ConversationDb {

  constructor() {
    this.isConnected = false;
  }

  _connect() {
    return new Promise(function (resolve, reject) {
      sql.connect(dbConfig)
        .then(pool => { console.log(pool); resolve(pool); })
        .catch(err => reject(err));
    });
  }

  async _connectAsync() {
    try {
      this.db = await this._connect();
      this.isConnected = true;
    }
    catch (err) {
      console.log(err);
    }
  }

  async getSenderIdByEmail(email) {
    if (!this.isConnected) await this._connectAsync();
    console.log('connected');

    return await this.db.request()
      .input('email_address', email)
      .query('select TOP 1 * from dealers where EmailAddress = @email_address');
  }

  close() {
    this.db.close();
    this.isConnected = false;
  }

}