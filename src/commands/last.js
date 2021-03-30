const dotenv = require('dotenv');
const fetch = require('node-fetch');
const { Message, MessageEmbed } = require('discord.js');
const { loggers } = require('winston');
const logger = require('../logger/logger');

dotenv.config();
const { API_AUTH_KEY_CLIENT, API_ENDPOINT } = process.env;
const commandName = 'last'; 

module.exports = {
  name: commandName,
  description: 'Get last game stats',
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

    const getPlayerMatchHistory = await fetch(`${API_ENDPOINT}/players/${playerID}/history?game=${game}&offset=0&limit=20`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${API_AUTH_KEY_CLIENT}`
      }
    })

    if ( getPlayerMatchHistory.status != '200' ) {
      message.channel.send(`Uncaught error: ${getPlayerMatchHistory.status}`)
      logger.debug(`HTTP error: ${getPlayerMatchHistory.status}`)
      return;
    } 

    const playerMatchHistory = await getPlayerMatchHistory.json();
    const latestMatchID = playerMatchHistory.items[0].match_id;

    const getLatestMatch = await fetch(`${API_ENDPOINT}/matches/${latestMatchID}/stats`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${API_AUTH_KEY_CLIENT}`
      }
    })

    if ( getLatestMatch.status != '200' ) {
      message.channel.send(`Uncaught error: ${getLatestMatch.status}`)
      logger.debug(`HTTP error: ${getLatestMatch.status}`)
      return;
    } 

    const latestMatch = await getLatestMatch.json();
    const findPlayerinTeam = latestMatch.rounds[0].teams[0].players.find(player => player == playerID);
    console.log(findPlayerinTeam);
   }
}