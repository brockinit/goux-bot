const request = require('request-promise-native');
const { GROUP_ME_API } = require('../config');

let beforeId;

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
    return;
  }
  return res;
}

async function getMoreMessages() {
  let res;
  try {
    res = await getMessages();
  } catch (err) {
    console.error(`Error getMessages: ${err.message}`);
  }
  // No more messages
  if (res.meta.code === 304) {
    console.log('Done!!');
    return;
  }
  const { messages } = res.response;
  console.log(messages, 'messages');
  beforeId = messages[messages.length - 1].id;
  return getMoreMessages();
}

getMoreMessages();
