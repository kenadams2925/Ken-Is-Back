const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'mcl',
    aliases: ['mcpl'],
    description: 'Minecraft Online Players',
    run: async (client, message, args) => {

        const serverIP = 'logandev.info:25566';
        const url = `https://mcapi.us/server/status?ip=${serverIP}`;

        // Send an initial message to be edited later
        let sentMessage;

        const fetchAndUpdate = async () => {
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

                    if (!sentMessage) {
                        sentMessage = await message.channel.send({ embeds: [embed] });
                    } else {
                        await sentMessage.edit({ embeds: [embed] });
                    }
                } else {
                    const embed = new EmbedBuilder()
                        .setColor("FF0000")
                        .setTitle(`Minecraft Server Stats: ${serverIP}`)
                        .addFields(
                            { name: 'Status', value: 'Offline', inline: true }
                        )
                        .setTimestamp();

                    if (!sentMessage) {
                        sentMessage = await message.channel.send({ embeds: [embed] });
                    } else {
                        await sentMessage.edit({ embeds: [embed] });
                    }
                }
            } catch (error) {
                console.error(error);
                if (!sentMessage) {
                    sentMessage = await message.channel.send(`Could not retrieve server stats. The server might be offline.`);
                } else {
                    sentMessage.edit(`Could not retrieve server stats. The server might be offline.`);
                }
            }
        };

        // Fetch and update every 10 seconds
        fetchAndUpdate(); // Initial fetch
        setInterval(fetchAndUpdate, 10000); // Update every 10 seconds
    }
};
