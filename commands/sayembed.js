const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'sayembed',
    aliases: ['se'],
    description: 'Say anything with the bot',
    run: async (client, message, args) => {
        // Check if the message author is you
        if (message.author.id !== "936474701000224768" && message.author.id !== "836294168632361000") {
            return message.reply('You do not have permission to use this command.');
        }

        // Check if there's text to include in the embed
        const text = args.join(' ');
        if (!text) {
            return message.reply('Please provide a title for the embed.');
        }

        // Delete the original message
        await message.channel.bulkDelete(1);

        const embed = new EmbedBuilder()
            .setTitle(text);

        // Introduce a delay of 1 second (1000 milliseconds) before sending the new message
        setTimeout(() => {
            message.channel.send({ embeds: [embed] });
        }, 1000);
    }
}
