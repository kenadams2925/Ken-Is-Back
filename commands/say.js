const { EmbedBuilder } = require('discord.js');
const embed = new EmbedBuilder();

module.exports = {
    name: 'say',
    aliases: ['s'],
    description: 'Say anything with the bot',
    run: async (client, message, args) => {
        if (message.author.id !== "936474701000224768" && message.author.id !== "836294168632361000") {
            return message.reply('You do not have permission to use this command.');
        }

        // Check if there's text to send
        const text = args.join(' ');
        if (!text) {
            return message.reply('Please provide a message to say.');
        }

        // Delete the original message
        await message.channel.bulkDelete(1);

        // Introduce a delay of 1 second (1000 milliseconds) before sending the new message
        setTimeout(() => {
            message.channel.send(text);
        }, 1000);
    }
}
