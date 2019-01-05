const request = require('request-promise-native');
const { GROUP_ME_API } = require('../config');

async function getMessages(query) {
  let res;
  const options = {
    headers: {
      'X-Access-Token': GROUP_ME_API.TOKEN,
    },
    uri: `${GROUP_ME_API.HOST}${GROUP_ME_API.GET_MESSAGES}`,
    json: true,
  };
  if (query) {
    options.uri += query;
  }
  try {
    res = await request.get(options);
  } catch (err) {
    console.error(`Error getting messages: ${err.message}`);
  }
  return res;
}

module.exports = {
  getMessages,
};