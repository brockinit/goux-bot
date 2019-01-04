'use strict';
const request = require('request-promise-native');

const BOT_ID = 'd4fb7af210bd3e1bfc39be2a99';
const GROUP_ME_API = 'https://api.groupme.com/v3/bots/post';
const GIPHY_API = 'https://api.giphy.com/v1/gifs/';

async function getFailGif() {
  const giphy = {
    baseURL: GIPHY_API,
    key: 'dc6zaTOxFJmzC',
    tag: 'fail',
    type: 'random',
    rating: 'r'
  };
  const giphyURL = giphy.baseURL +
    giphy.type +
    '?api_key=' +
    giphy.key +
    '&tag=' +
    giphy.tag +
    '&rating=' +
    giphy.rating;
    let gifData;
    let result;

  try {
    gifData = await request.get(giphyURL);
    let gouxReqOptions = {
      uri: GROUP_ME_API,
      json: true,
      body: {
        bot_id: BOT_ID,
        text: JSON.parse(gifData).data.url,
      },
    };
    await request.post(gouxReqOptions);
  } catch (err) {
    console.log(err, 'error');
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Ok',
      input: '',
    }),
  };
}

async function refsDontAffectGames() {
  try {
    let gouxReqOptions = {
      uri: GROUP_ME_API,
      json: true,
      body: {
        bot_id: BOT_ID,
        text: 'rEfs DoNt AfFeCt GaMeS',
      },
    };
    await request.post(gouxReqOptions);
  } catch (err) {
    console.log(err, 'error');
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Ok',
      input: '',
    }),
  };
}

module.exports.hello = async (event, context) => {
  const { text } = JSON.parse(event.body);
  if (text.includes('kms') || text.includes('kys')) {
    return getFailGif();
  } else if (text.includes('penalty') || text.includes('horrible call')) {
    return refsDontAffectGames();
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Ok',
      input: event,
    }),
  };
};

