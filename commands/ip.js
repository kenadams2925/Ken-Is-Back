const { EmbedBuilder } = require('discord.js');
const samp = require('samp-query');

const embed = new EmbedBuilder();

const ip = '163.172.105.21:7777'.split(':');
        const options = {
            host: ip[0],
            port: ip[1] || 7777
        };


module.exports = {
    name: 'ip',
    aliases: ['server ip'],
    description: 'Shows IP address of a SA:MP Server',
    run: async (client, message, args) => {
        if(!ip)
            return message.channel.send('IP address is not set in the .env file!');

      
        const color = await message.guild?.members.fetch(message.client.user.id).then(color => color.displayHexColor) || '#000000';
        await samp(options, (error, query) => {
            if(error){
              console.log(error)
                embed.setColor(color);
                embed.setTitle('❌ Server is offline');
                embed.setDescription(`**IP:** \`${options.host}:${options.port}\``);
                return message.channel.send({ embeds: [embed] });
            }
            else{
                embed.setColor(color);
                embed.setTitle('✅ Server is online!');
                embed.setDescription(`**IP:** \`${options.host}:${options.port}\``);
                return message.channel.send({ embeds: [embed] });
            }
        });

        return;
    }
}