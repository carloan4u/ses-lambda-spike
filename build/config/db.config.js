var credentials = require('./db.credentials.js');

const config = {
  user: credentials.user,
  password: credentials.password,
  server: 'pbtemail.cl0xzuipljxk.eu-west-1.rds.amazonaws.com',
  database: 'EmailSpike',
  pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 5000
  }
}

module.exports = config;