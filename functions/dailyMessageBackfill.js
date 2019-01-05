const getMessagesSince = require('../utils/getMessagesSince');

module.exports.handler = async (event, context, callback) => {
  try {
    await getMessagesSince();
    callback(null);
  } catch (err) {
    callback(err);
  }
};
