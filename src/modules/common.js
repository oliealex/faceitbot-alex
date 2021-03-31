const logger = require('../logger/logger');

function messageConcat(data) {
    let message = '';

    for (let i = 0; i < data.length; i += 1) {
      message = message.concat(`**\`${data[i][0]}:\`** \`${data[i][1]}\`\n`);
    }

    return message
}

function httpResponseCheck(status, message) {
  if ( status != '200' ) {
    message.channel.send(`Uncaught error: ${status}`)
    logger.debug(`HTTP error: ${status}.`)
    return true;
  } 
  return false;
}


module.exports = {messageConcat, httpResponseCheck}