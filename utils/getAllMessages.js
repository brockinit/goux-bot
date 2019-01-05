const client = require('./db');
const { getMessages } = require('./groupmeApi');
const { MONGO_DBNAME } = require('../config');

let beforeId;
let totalMessages = 0;

// Running this script collects all messages available from a given group chat
client.connect(err => {
  if (err) {
    console.error(err.message);
    process.exit(0);
  }
  const collection = client.db(MONGO_DBNAME).collection('messages');

  async function getMoreMessages() {
    const query = '?limit=100';
    if (beforeId) {
      query += `&before+id=${beforeId}`;
    }
    const res = await getMessages(query);
    // No more messages
    if (res === 304) {
      console.log('Done!!');
      return client.close();
    }
    const { messages } = res.response;
    beforeId = messages[messages.length - 1].id;
    collection('messages').insertMany(messages, (err, r) => {
      if (err) {
        console.error('Error inserting documents', err.message);
      }
      totalMessages += messages.length;
      console.log(`Successfully inserted ${messages.length} documents! Total: ${totalMessages}`);
      return getMoreMessages();
    });
  }
  getMoreMessages();
});
