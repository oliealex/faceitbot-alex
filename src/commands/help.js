const { Message, MessageEmbed } = require('discord.js');

const commandName = 'help';

module.exports = {
  name: commandName,
  description: 'Help command',
  /**
  * @param {import('discord.js').Message} message
  */
  async execute(message, args) {
    const embed = new MessageEmbed()
    .setTitle('__COMMANDS__')
    .setDescription(`**PREFIX=**!\n**help** - Sends this message.\n**player <Player name>** - Returns player stats.\n**last <Player name>** - Returns players latest game`)
    .setThumbnail('https://pbs.twimg.com/profile_images/1349712390628270081/KpMEtOII.png')
    .setFooter("Faceit CSGO stats")
    .setColor(0xFF4500);

    message.channel.send(embed);
  }
}