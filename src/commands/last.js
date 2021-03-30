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
}