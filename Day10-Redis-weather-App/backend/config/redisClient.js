const redis = require('redis');
const client = redis.createClient();

client.connect().then(() => console.log("Connected to Redis"));

module.exports = client;
