const { EmbedBuilder, client } = require('discord.js');


const embed = new EmbedBuilder();



module.exports = {
    name: 'help',
    aliases: ['helps'],
    description: 'Shows the commands',
    run: async (client, message, args) => {

      
        const color = await message.guild?.members.fetch(message.client.user.id).then(color => color.displayHexColor) || '#000000';

         const embed = new EmbedBuilder()
                .setColor(color)
    .setTitle('🤖 Bot Commands')
    .addFields(
        { name: '🛠️  My Prefix . ', value: 'Example : .help' },
        { name: '\t', value: '\t' },
        { name: '\t', value: '\t' },
        { name: '.players', value: '👨‍👨‍👦‍👦 Displays the online players of vG', inline: true },
        { name: '.ip', value: '🔎 Indicates whether vG is online or offline', inline: true },
        { name: '.server', value: '💬 Provides information about vG', inline: true },
        { name: '\t', value: '\t' },
        { name: '.ping', value: '🏓 Responds with its ping and uptime', inline: true },
        { name: '.sapd list', value: '👮‍♂️ View the members of the vG PD', inline: true },
        { name: '.cri', value: '🥲 cris evritim', inline: true },
        { name: '.laugh', value: '😂 laugh at a user', inline: true },
        { name: '.kill', value: '🔪 Kill a user (fun)', inline: true },
        { name: '.mc', value: '⛏️ Displays the online players of vMc', inline: true },
    )
      .setTimestamp()
       

message.channel.send({ embeds: [embed] });
}
}