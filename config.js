const path = require('path');
// require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config();

module.exports = {
  db_name: process.env.DB_NAME,
  port: process.env.PORT,
};
