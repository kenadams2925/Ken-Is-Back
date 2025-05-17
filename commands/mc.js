const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'mc',
    aliases: ['mcp'],
    description: 'Minecraft Online Players',
    run: async (client, message, args) => {

      //  const serverIP = 'logandev.info:25566';
        const serverIP = 'play.jinxko.com';
        const url = `https://mcapi.us/server/status?ip=${serverIP}`;

        try {
            const response = await axios.get(url);
            const serverStats = response.data;

            if (serverStats.online) {
                let playerNames = 'No players online';
                if (serverStats.players.sample && serverStats.players.sample.length > 0) {
                    playerNames = serverStats.players.sample.map(player => player.name).join(', ');
                }

                const embed = new EmbedBuilder()
                    .setColor("00FFFF")
                    .setTitle(`Minecraft Server Stats: ${serverIP}`)
                    .addFields(
                        { name: 'Status', value: 'Online', inline: true },
                        { name: 'Players', value: `${serverStats.players.now}/${serverStats.players.max}`, inline: true },
                        { name: 'Online Players', value: playerNames }
                    )
                    .setTimestamp();

                message.channel.send({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setColor("FF0000")
                    .setTitle(`Minecraft Server Stats: ${serverIP}`)
                    .addFields(
                        { name: 'Status', value: 'Offline', inline: true }
                    )
                    .setTimestamp();

                message.channel.send({ embeds: [embed] });
            }
        } catch (error) {
            console.error(error);
            message.channel.send(`Could not retrieve server stats. The server might be offline.`);
        }
    }
}
