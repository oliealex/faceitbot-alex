const dotenv = require('dotenv')
const Discord = require('discord.js')
const fs = require('fs');

// Dummy webserver
const express = require('express')
const app = express()
const port = 60

app.get('/', (req, res) => {
  res.send('Discord Bot')
})

app.listen(port, () => {})


dotenv.config();
const {PREFIX, BOT_TOKEN } = process.env;
const logger = require('./logger/logger')

// Initiate discord.js objects
const client = new Discord.Client();
client.commands = new Discord.Collection();

// Read directory
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

// Require command modules
for (let i = 0; i < commandFiles.length; i += 1) {
  const command = require(`./commands/${commandFiles[i]}`);
  client.commands.set(command.name, command);
}

// Ready check
client.once('ready', () => {
  logger.info('stats-discordbot started and listening to commands');
})

// Command handler
client.on('message', async (message) => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) {
    // If message starts with prefix or message is sent by bot
    return;
  }

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  logger.debug(`${message.author.username} executes !${command}`);

  if (!client.commands.has(command)) {
    logger.debug(`This command does not exist '${command}'`)
  }

 // try {
    await client.commands.get(command).execute(message, args);
 // } catch (error) {
 //   logger.error(`Uncaught error while executing command ${command}: ${error}`)
 //   await message.reply(`Error executing !${command}`);
 // }
});

// Token
client.login(BOT_TOKEN);