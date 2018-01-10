import credentials from './db.credentials.js';

export default {
  user: credentials.username,
  password: credentials.password,
  server: 'pbtemail.cl0xzuipljxk.eu-west-1.rds.amazonaws.com',
  database: 'EmailSpike',
  pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 5000
  }
}