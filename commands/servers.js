const { EmbedBuilder } = require('discord.js');
const samp = require('samp-query');

const ip = '163.172.105.21:7777'.split(':');
        const options = {
            host: ip[0],
            port: ip[1] || 7777
        };

module.exports = {
    name: 'server',
    aliases: ['servers'],
    description: 'Displays informations about SA:MP Server',
    run: async (client, message, args) => {
        if(!ip)
            return message.channel.send('IP address is not set in the .env file!');

        const color = await message.guild?.members.fetch(message.client.user.id).then(color => color.displayHexColor) || '#000000';

     
    
        await samp(options, (error, query) => {
            if(error){
                const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle(`${options.host}:${options.port}`)
                .setDescription('Server is offline');
        
                return message.channel.send({ embeds: [embed] });
            }
            else{
                const pass = (query['passworded']) ? 'yes' : 'no';
                const embed = new EmbedBuilder()
                    .setColor(color)
                    .setTitle(`**${query['hostname']}**`)
                    .addFields(
                        {name: 'IP:PORT', value: `${options.host}:${options.port}`, inline: true},
                        {name: 'PLAYERS', value: `${query['online'] || 0}/${query['maxplayers'] || 0}`, inline: true},
                        {name: 'GAMEMODE', value: query['gamemode'] || '-', inline: true},
                        {name: 'MAP', value: query['rules']['mapname'] || '-', inline: true},
                        {name: 'LANGUAGE', value: query['language'] || '-', inline: true},
                        {name: 'TIME - WEATHER', value: query['rules']['worldtime']+' - '+query['rules']['weather'], inline: true},
                        {name: 'VERSION', value: query['rules']['version'] || '-', inline: true},
                        {name: 'PASSWORD', value: pass, inline: true},
                        {name: 'URL', value: `[${query['rules']['weburl']}](https://${query['rules']['weburl'] || 'https://sa-mp.com'})`, inline: true}
                    );
    
                return message.channel.send({ embeds: [embed] });
            }
        });
    }
}