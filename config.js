require('dotenv').config();

module.exports = {
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT,
  NEWRELIC: process.env.NEWRELIC,
  REDIS_URL: process.env.REDIS_URL,
};
