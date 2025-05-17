module.exports = {
    name: 'cri',
    aliases: ['c'],
    description: 'Makes the bot reply with a crying message.',
    run: async (client, message, args) => {
        // Get the user who sent the command
        const user = message.author;
        if(message.author.id == '836294168632361000')
            message.channel.send(`${user} cris evritim coz she doesnt love :((`);
        else
        message.channel.send(`${user} cris evritim :((`);
    }
};
