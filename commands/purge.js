const { Permissions } = require('discord.js');

module.exports = {
    name: 'purge',
    description: 'Delete messages from a channel.',
    aliases: ['pu'],
    usage: '[amount]',
    cooldown: 5,
    guildOnly: true,
    args: false,
    run: async (client, message, args) => {
        // Check if the message author is the bot owner or has Administrator permission
        if (message.author.id !== "936474701000224768" && message.author.id !== "1069232765121351770") {
            return message.reply('You do not have permission to use this command.');
        }
        

        // Get the amount of messages to delete from the command arguments
        let amount = parseInt(args[0]) || 2;

        // Check if the amount exceeds the Discord limit
        if (amount > 100) {
            amount = 100;  // Set it to the maximum allowed value
        }

        // Delete the specified number of messages, including the command itself.
        message.channel.bulkDelete(amount)
            .then(() => {
                // Notify the number of messages deleted and automatically remove the notification.
                message.channel.send(`Deleted ${amount} messages.`)
                    .then((msg) => {
                        msg.delete({ timeout: 5000 });
                    });
            })
            .catch((error) => {
                console.error('Error deleting messages:', error);
                message.reply('There was an error trying to delete messages.');
            });
    },
};
