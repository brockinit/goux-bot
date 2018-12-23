'use strict';
const request = require('request-promise-native');

function buildGiphyUrl() {
  const giphy = {
    baseURL: 'https://api.giphy.com/v1/gifs/',
    key: 'dc6zaTOxFJmzC',
    tag: 'fail',
    type: 'random',
    rating: 'r'
  };
  return giphy.baseURL +
    giphy.type +
    '?api_key=' +
    giphy.key +
    '&tag=' +
    giphy.tag +
    '&rating=' +
    giphy.rating;
}

async function getFailGif() {
  let gifData;
  let result;

  try {
    gifData = await request.get(buildGiphyUrl());
    const gouxReqOptions = {
      uri: 'https://api.groupme.com/v3/bots/post',
      json: true,
      body: {
        bot_id: 'd4fb7af210bd3e1bfc39be2a99',
        text: `Lol, SUCKS. ${JSON.parse(gifData).data.url}`,
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
    getFailGif();
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Ok',
        input: event,
      }),
    };
  }
};

