const MongoClient = require('./db');
const { getMessages } = require('./groupmeApi');
const { MONGO_DBNAME } = require('../config');

let sinceId;
let totalMessages = 0;

// Running this script collects all messages that were posted since a
// given message
async function getMessagesSince() {
  let client;
  let latestMessages;
  try {
    client = await MongoClient.connect();
  } catch (err) {
    console.error(err.message);
    process.exit(0);
  }
  const collection = client.db(MONGO_DBNAME).collection('messages');

  // Find the newest message stored in the collection
  try {
    latestMessages = await collection.find().limit(1).sort(['created_at', -1]).toArray();
    sinceId = '154672649562384802';
  } catch(err) {
    console.error('Error retrieving newest message from db', err.message);
    return client.close();
  }

  async function getMoreMessages() {
    if (!sinceId) {
      client.close()
      throw new Error('Missing ID of latest message');
    }
    const query = `?limit=100&since_id=${sinceId}`;
    const res = await getMessages(query);
    // No more messages
    if (res === 304) {
      console.log('Done!!');
      return client.close();
    }
    const { messages } = res.response;
    // Messages are ordered with the latest first, so grab that one
    sinceId = messages[0].id;
    try {
      await collection.insertMany(messages);
    } catch (err) {
      console.error('Error inserting documents', err.message);
      return client.close();
    }
    totalMessages += messages.length;
    console.log(`Successfully inserted ${messages.length} documents! Total: ${totalMessages}`);
    return getMoreMessages();
  }
  getMoreMessages();
}

module.exports = getMessagesSince;
