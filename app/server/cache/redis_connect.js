const redis = require('redis');
const { REDIS_URL } = require('../../config');
const client = redis.createClient({
  url: REDIS_URL,
  legacyMode: true,
});

client.connect();

client.on('connect', () => {
  console.log('REDIS IS CONNECTED');
});

client.on('error', (error) => {
  console.log('REDIS ERROR', error);
});

module.exports = client;
