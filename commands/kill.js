const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'kill',
    description: 'Sends a random funny kill GIF targeting someone.',
    run: async (client, message, args) => {
        // Check if a mention or argument is provided
        const target = args[0];
        if (!target) {
            return message.channel.send('You need to mention someone or provide a name to "kill"! 😠');
        }

        // List of GIFs
        const gifs = [
            'https://cdn.weeb.sh/images/B1qosktwb.gif',
            'https://cdn.weeb.sh/images/B1VnoJFDZ.gif',
            'https://cdn.weeb.sh/images/r11as1tvZ.gif',
            'https://cdn.weeb.sh/images/HyXTiyKw-.gif'
        ];

        // Select a random GIF from the list
        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

        // Create an embed with the GIF
        const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setDescription(`${message.author} just killed ${target}! 😱`)
            .setImage(randomGif); // Set the image in the embed

        // Send the embed
        message.channel.send({ embeds: [embed] });
    }
};
