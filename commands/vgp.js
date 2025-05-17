const { EmbedBuilder } = require('discord.js');
const samp = require('samp-query');
const AsciiTable = require('ascii-table');

const ip = '163.172.105.21:7777'.split(':');
const options = {
    host: ip[0],
    port: ip[1] || 7777
};

module.exports = {
    name: 'vgp',
    aliases: ['pl'],
    description: 'Lists all online players if players number is lower or equal 100',
    run: async (client, message, args) => {
        if (!ip) return message.channel.send('IP address is not set in the .env file!');

        const initialEmbed = await sendPlayerInformation(message);


        setInterval(async () => {
            try {
                await updatePlayerInformation(message, initialEmbed);
            } catch (error) {
                console.error(error);

            }
        }, 10000); // 300,000 milliseconds = 5 minutes
    },
};

// Function to send the initial player information
async function sendPlayerInformation(message) {
    const query = await sampQuery(options);
    const color =
        (await message.guild?.members.fetch(message.client.user.id).then(color => color.displayHexColor)) || '#000000';
        let idk = Math.floor((Date.now()) / 1000)
        let um = idk + 10;

    const table1 = new AsciiTable().setHeading('ID','NICK','SCORE','PING').setAlign(2, AsciiTable.RIGHT);

    const embed = new EmbedBuilder().setColor(color).setTitle(`**${query['hostname']}**`).setDescription(`Last update - <t:${Math.floor((Date.now()) / 1000)}:R> \n New Update - <t:${um}:R>`).setTimestamp();

    if (query['online'] > 0) {
        if (query['online'] > 100) {
            embed.addFields({ name: 'PLAYERS LIST', value: '*Number of players is greater than 100. I cannot list them!*' });
        } else if (query['players'].length === 0) {
            embed.addFields({ name: 'PLAYERS LIST', value: '*I could not get the players list. Try again...*' });
        } else {
            if (query['online'] > 0) {
                for (var i = 0; i < 20; i++) {
                    if (query['players'][i] !== undefined) {
                        table1.addRow(query['players'][i]['id'], query['players'][i]['name'], query['players'][i]['score'], query['players'][i]['ping']);
                    }
                }
                embed.addFields({ name: `${query['online']}/${query['maxplayers']}`, value: '```\n' + table1 + '```' });
                return message.channel.send({ embeds: [embed] });
            }
        }
    } else if (query['online'] === 0) {
        embed.addFields({ name: 'PLAYERS LIST', value: '*Server is empty*' });
        return message.channel.send({ embeds: [embed] });
    }
}

// Function to update player information in the existing message
async function updatePlayerInformation(message, initialEmbed) {
    const query = await sampQuery(options);
    const color =
        (await message.guild?.members.fetch(message.client.user.id).then(color => color.displayHexColor)) || '#000000';
        let idk = Math.floor((Date.now()) / 1000)
        let um = idk + 10;

    const table1 = new AsciiTable().setHeading('ID','NICK','SCORE','PING').setAlign(2, AsciiTable.RIGHT);

    const embed = new EmbedBuilder().setColor(color).setTitle(`**${query['hostname']}**`).setDescription(`Last update - <t:${Math.floor((Date.now()) / 1000)}:R> \n New Update - <t:${um}:R>`).setTimestamp();

    if (query['online'] > 0) {
        if (query['online'] > 100) {
            embed.addFields({ name: 'PLAYERS LIST', value: '*Number of players is greater than 100. I cannot list them!*' });
        } else if (query['players'].length === 0) {
            embed.addFields({ name: 'PLAYERS LIST', value: '*I could not get the players list. Try again...*' });
        } else {
            if (query['online'] > 0) {
                for (var i = 0; i < 20; i++) {
                    if (query['players'][i] !== undefined) {
                        table1.addRow(query['players'][i]['id'], query['players'][i]['name'], query['players'][i]['score'], query['players'][i]['ping']);
                    }
                }
                embed.addFields({ name: `${query['online']}/${query['maxplayers']}`, value: '```\n' + table1 + '```' });

                // Edit the existing message with new information
                await initialEmbed.edit({ embeds: [embed] });
            }
        }
    } else if (query['online'] === 0) {
        embed.addFields({ name: 'PLAYERS LIST', value: '*Server is empty*' });

        // Edit the existing message with new information
        await initialEmbed.edit({ embeds: [embed] });
    }
}

// Function to query the server
function sampQuery(options) {
    return new Promise((resolve, reject) => {
        samp(options, (error, query) => {
            if (error) {
                reject(error);
            } else {
                resolve(query);
            }
        });
    });
}
