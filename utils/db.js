
const MongoClient = require('mongodb').MongoClient;
const { MONGO_URL } = require('../config');

module.exports = new MongoClient(MONGO_URL);
