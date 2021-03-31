const dotenv = require('dotenv');
const fetch = require('node-fetch');
const { Message, MessageEmbed } = require('discord.js');
const logger = require('../logger/logger');
const common = require('../modules/common');

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

    if (common.httpResponseCheck(getPlayerData.status, message)) {
      return;
    }

    const playerData = await getPlayerData.json();
    const playerID = playerData.player_id;
    const game = 'csgo'

    const getPlayerMatchHistory = await fetch(`${API_ENDPOINT}/players/${playerID}/history?game=${game}&offset=0&limit=5`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${API_AUTH_KEY_CLIENT}`
      }
    })

    if (common.httpResponseCheck(getPlayerMatchHistory.status, message)) {
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

    if (common.httpResponseCheck(getLatestMatch.status, message)) {
      return;
    }

    const latestMatch = await getLatestMatch.json();
    const teams = latestMatch.rounds[0].teams;
    const players = teams[0].players.concat(teams[1].players);
    const currentPlayer = players.find(player => player.player_id == playerID)
    const currentPlayerStats = currentPlayer.player_stats;
    const matchStats = latestMatch.rounds[0].round_stats
    const teamWinner = teams.find(team => team.team_id === matchStats.Winner).team_stats.Team;
    matchStats.Winner = `${teamWinner}`

    const sortedMatchStats = Object.entries(matchStats).sort();
    const sortedCurrentPlayerStats = Object.entries(currentPlayerStats).sort();
    const messagePlayerStats = common.messageConcat(sortedCurrentPlayerStats);
    const messageMatchStats = common.messageConcat(sortedMatchStats);

    const embed = new MessageEmbed()
    .setTitle(`__Game Stats__`)
    .setColor(0xFF4500)
    .addField('Match stats', `${messageMatchStats}`)
    .addField('Player stats', `${messagePlayerStats}`)
    .setThumbnail('https://pbs.twimg.com/profile_images/1349712390628270081/KpMEtOII.png')
    .setFooter("Faceit CSGO stats");

    message.channel.send(embed);
   }
}