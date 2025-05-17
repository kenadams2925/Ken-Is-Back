module.exports = {
    name: 'remember',
    aliases: ['thinking', 'r', 'think'],
    description: 'Makes the bot reply with a joke message.',
    run: async (client, message, args) => {

        const user = message.author;

        if (message.author.id === '836294168632361000') {
            message.channel.send(`${user} remembers she doesn't love him :(`);
     }
         else if (message.author.id === '936474701000224768') {
            message.channel.send(`${user} reminded <@836294168632361000> about her.`);
         }
           else {
            message.channel.send(`${user}, why are you using this command? It's not for you.`);
        }
    }
};
