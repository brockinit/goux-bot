const request = require('request-promise-native');
const client = require('./db');
const { GROUP_ME_API, MONGO_DBNAME } = require('../config');

let beforeId;
let totalMessages = 0;

// Running this script collects all messages available from a given group chat
client.connect(err => {
  if (err) {
    console.error(err.message);
    process.exit(0);
  }
  const db = client.db(MONGO_DBNAME);

  async function getMessages() {
    let res;
    const options = {
      headers: {
        'X-Access-Token': GROUP_ME_API.TOKEN,
      },
      uri: `${GROUP_ME_API.HOST}${GROUP_ME_API.GET_MESSAGES}?limit=100`,
      json: true,
    };
    if (beforeId) {
      options.uri += `&before_id=${beforeId}`;
    }
    try {
      res = await request.get(options);
    } catch (err) {
      console.error(`Error getting messages: ${err.message}`);
      return err.code;
    }
    return res;
  }

  async function getMoreMessages() {
    const res = await getMessages();
    // No more messages
    if (res === 304) {
      console.log('Done!!');
      return client.close();
    }
    const { messages } = res.response;
    beforeId = messages[messages.length - 1].id;
    db.collection('messages').insertMany(messages, (err, r) => {
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
