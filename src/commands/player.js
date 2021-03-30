const dotenv = require('dotenv');
const fetch = require('node-fetch');
const { Message, MessageEmbed } = require('discord.js');
const { loggers } = require('winston');
const logger = require('../logger/logger');

dotenv.config();
const { API_AUTH_KEY_CLIENT, API_ENDPOINT } = process.env;
const commandName = 'player'; 

module.exports = {
  name: commandName,
  description: 'Get Player stats',
  /**
  * @param {import('discord.js').Message} message
  */
  async execute(message, args) {
    const playerName = args[0];

    const getPlayerData = await fetch(`${API_ENDPOINT}/players?nickname=${playerName}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${API_AUTH_KEY_CLIENT}`
      }
    })

    if ( getPlayerData.status != '200' ) {
      message.channel.send(`Uncaught error: ${getPlayerData.status}`)
      logger.debug(`HTTP error: ${getPlayerData.status}`)
      return;
    } 

    const playerData = await getPlayerData.json();
    const playerID = playerData.player_id;
    const game = 'csgo'

    const getPlayerStats = await fetch(`${API_ENDPOINT}/players/${playerID}/stats/${game}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${API_AUTH_KEY_CLIENT}`
      }
    })

    if ( getPlayerStats.status != 200 ) {
      message.channel.send(`HTTP error code: ${getPlayerData.status}`)
      logger.debug(`HTTP error: ${getPlayerStats.status}`)
      return;
    }

    const playerStats = await getPlayerStats.json();
    const lifeTimeStats = playerStats.lifetime;
    const recentResults = lifeTimeStats['Recent Results'].map(item => item == 1 ? 'Win' : 'Loss');
    delete lifeTimeStats['Recent Results'];
    
    let messageDescription = '';
    const sortedLifeTimeStats = Object.entries(lifeTimeStats).sort();

    for (let i = 0; i < sortedLifeTimeStats.length; i += 1) {
      messageDescription = messageDescription.concat(`**\`${sortedLifeTimeStats[i][0]}:\`** \`${sortedLifeTimeStats[i][1]}\`\n`)
    }

    const embed = new MessageEmbed()
    .setTitle(`__Player Stats__`)
    .setColor(0xFF4500)
    .setDescription(`${messageDescription}`)
    .setThumbnail('https://pbs.twimg.com/profile_images/1349712390628270081/KpMEtOII.png')
    .setFooter("Faceit CSGO stats")
    .addField('Recent Matches', `\`${recentResults}\``);

    message.channel.send(embed);
  }
}