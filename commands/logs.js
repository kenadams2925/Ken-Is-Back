const samp = require('samp-query');
const wait = require('node:timers/promises').setTimeout;

const ip = '163.172.105.21:7777'.split(':');
const options = {
    host: ip[0],
    port: ip[1] || 7777
};

let lastKnownPlayers = [];

module.exports = {
    startLogging: function(client) {
        const channel = client.channels.cache.get('1276171324221423637'); // Replace with your channel ID
        if (!channel) {
            console.error('Channel not found');
            return;
        }

        console.log(`Started logging vG Server on bot startup.`);

        // Schedule server check every 10 seconds
        setInterval(() => checkServer(client, channel), 10000);
    }
};

async function checkServer(client, channel) {
    try {
        samp(options, (error, query) => {
            if (error) {
                console.error('Error fetching server data:', error);
                return;
            }

            if (!query || !query.players) {
                console.error('Unexpected server response:', query);
                return;
            }

            const currentPlayers = query.players || [];

            // Track joined and left players
            const joinedPlayers = currentPlayers.filter(player => !lastKnownPlayers.some(p => p.id === player.id));
            const leftPlayers = lastKnownPlayers.filter(player => !currentPlayers.some(p => p.id === player.id));

            // Update last known players
            lastKnownPlayers = currentPlayers;

            // Send messages for joined and left players
            joinedPlayers.forEach(player => {
                const joinTime = Math.floor(Date.now() / 1000); // Current Unix timestamp
                const formattedJoinTime = `<t:${joinTime}:R>`; // Relative time format
                const initialMessage = `**${player.name}** (score not available yet) has joined the server at ${formattedJoinTime}.`;

                channel.send(initialMessage).then(sentMessage => {
                    // Check player's score with retries if it's still 0
                    checkAndUpdateScore(client, sentMessage, player, 10 * 1000, 5); // 30 seconds wait and 3 retries
                });
            });

            leftPlayers.forEach(player => {
                const leaveTime = Math.floor(Date.now() / 1000); // Current Unix timestamp
                const formattedLeaveTime = `<t:${leaveTime}:R>`; // Relative time format
                channel.send(`**${player.name}** (score: ${player.score}) has left the server at ${formattedLeaveTime}.`);
            });
        });
    } catch (error) {
        console.error('Error in checkServer function:', error);
    }
}

function checkAndUpdateScore(client, sentMessage, player, waitTime, retries) {
    if (retries === 0) {
        console.log(`Max retries reached for player: ${player.name}`);
        return;
    }

    wait(waitTime).then(() => {
        samp(options, (error, query) => {
            if (error) {
                console.error('Error fetching updated server data:', error);
                return;
            }

            if (!query || !query.players) {
                console.error('Unexpected server response:', query);
                return;
            }

            const updatedPlayer = query.players.find(p => p.id === player.id);
            if (updatedPlayer) {
                if (updatedPlayer.score !== 0) {
                    const updatedScore = updatedPlayer.score;
                    sentMessage.edit(`**${player.name}** (${updatedScore}) has joined the server at <t:${Math.floor(Date.now() / 1000)}:R>.`);
                } else {
                    console.log(`Player ${player.name}'s score is still 0. Retrying...`);
                    checkAndUpdateScore(client, sentMessage, player, 10 * 1000, retries - 1); // Retry after 15 more seconds
                }
            }
        });
    });
}
