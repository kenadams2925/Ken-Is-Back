module.exports = {
    name: 'laugh',
    aliases: ['l'],
    description: 'Makes the bot reply with a laughin message.',
    run: async (client, message, args) => {

        const target = args[0];
        if (!target) {
            return message.channel.send('You need to mention someone or provide a name to "laugh"! 😠');
        }

        const user = message.author;
        message.channel.send(`${user} *laughs at* **${target}** :rofl:`);
    }
};
