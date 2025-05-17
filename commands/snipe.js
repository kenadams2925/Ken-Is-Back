const { EmbedBuilder } = require('discord.js');

let deletedMessages = new Map(); // Store deleted messages for each channel
let editedMessages = new Map();  // Store edited messages for each channel

module.exports = {
    name: 'snipe',
    description: 'Snipes the last deleted or edited message in the channel',
    
    run: async (client, message, args) => {
        const channelId = message.channel.id;
        const channelDeletedMessages = deletedMessages.get(channelId);
        const channelEditedMessages = editedMessages.get(channelId);
    
        // Get the most recent message from both deleted and edited messages
        let mostRecentMessage = null;
    
        if (channelDeletedMessages && channelDeletedMessages.length > 0) {
            const lastDeletedMessage = channelDeletedMessages[0];
            mostRecentMessage = {
                ...lastDeletedMessage,
                type: 'deleted',
                timestamp: lastDeletedMessage.deletedAt // Use deletedAt for timestamp
            };
        }
    
        if (channelEditedMessages && channelEditedMessages.length > 0) {
            const lastEditedMessage = channelEditedMessages[0];
            // Check if the edited message is more recent than the deleted one
            if (!mostRecentMessage || lastEditedMessage.timestamp > mostRecentMessage.timestamp) {
                mostRecentMessage = {
                    ...lastEditedMessage,
                    type: 'edited',
                    timestamp: lastEditedMessage.editedAt // Use editedAt for timestamp
                };
            }
        }
    
        // Check if we found a message to snipe
        if (mostRecentMessage) {
            const embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setAuthor({ name: mostRecentMessage.author });
    
            if (mostRecentMessage.type === 'deleted') {
                embed.setDescription(`**Deleted Message:** ${mostRecentMessage.content}`)
                    .setTimestamp(mostRecentMessage.timestamp)
                    .setFooter({ text: `Deleted at: ${new Date(mostRecentMessage.deletedAt).toLocaleString()}` });
            } else if (mostRecentMessage.type === 'edited') {
                embed.setDescription(`**Old Message:** ${mostRecentMessage.oldContent}\n**New Message:** ${mostRecentMessage.newContent}`)
                    .setTimestamp(mostRecentMessage.timestamp)
                    .setFooter({ text: `Edited at: ${new Date(mostRecentMessage.editedAt).toLocaleString()}` });
            }
    
            message.channel.send({ embeds: [embed] });
        } else {
            message.channel.send('No messages to snipe!');
        }
    },
    

    storeDeletedMessage: (message) => {
        if (message.author.bot) return;

        const channelId = message.channel.id;
        if (!deletedMessages.has(channelId)) {
            deletedMessages.set(channelId, []);
        }
        const channelMessages = deletedMessages.get(channelId);

        // Store the deleted message with timestamp
        channelMessages.unshift({
            content: message.content,
            author: message.author.tag,
            timestamp: message.createdTimestamp,
            deletedAt: Date.now() // Store the time when the message was deleted
        });

        // Keep only the last 10 messages
        if (channelMessages.length > 10) {
            channelMessages.pop();
        }

        deletedMessages.set(channelId, channelMessages);
    },

    storeEditedMessage: (oldMessage, newMessage) => {
        if (oldMessage.author.bot) return;
        const channelId = oldMessage.channel.id;
        if (!editedMessages.has(channelId)) {
            editedMessages.set(channelId, []);
        }
        const channelMessages = editedMessages.get(channelId);

        // Store the old and new edited message
        channelMessages.unshift({
            oldContent: oldMessage.content,
            newContent: newMessage.content,
            author: oldMessage.author.tag,
            timestamp: oldMessage.createdTimestamp,
            editedAt: Date.now() // Store the time when the message was edited
        });

        // Keep only the last 10 messages
        if (channelMessages.length > 10) {
            channelMessages.pop();
        }

        editedMessages.set(channelId, channelMessages);
    }
};

// Snipe list command for showing last 10 deleted and edited messages
// Snipe list command for showing last 10 deleted and edited messages
module.exports.snipelist = {
    name: 'snipelist',
    description: 'Lists the last 10 deleted or edited messages from all channels',
    
    run: async (client, message, args) => {
        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Last 10 Deleted or Edited Messages')
            .setTimestamp();

        let allMessages = [];
        let messagesCount = 0;

        // Aggregate all deleted messages
        for (const [channelId, channelMessages] of deletedMessages) {
            allMessages = allMessages.concat(
                channelMessages.map(msg => ({ ...msg, channelId, type: 'deleted' }))
            );
        }

        // Aggregate all edited messages
        for (const [channelId, channelMessages] of editedMessages) {
            allMessages = allMessages.concat(
                channelMessages.map(msg => ({ ...msg, channelId, type: 'edited' }))
            );
        }

        // Sort all messages by timestamp in descending order
        allMessages.sort((a, b) => b.timestamp - a.timestamp);

        // Add up to the last 10 messages to the embed
        for (const messageData of allMessages.slice(0, 10)) {
            let messageInfo = '';
            const channelName = client.channels.cache.get(messageData.channelId)?.name || 'Unknown Channel';
            if (messageData.type === 'deleted') {
                messageInfo = `\`\`\`Channel    -  ${channelName}\n` +
                              `Author     -  ${messageData.author}\n` +
                              `Message    -  ${messageData.content}\n` +
                              `Deleted At -  ${new Date(messageData.deletedAt).toLocaleString()}\n\`\`\``;
            } else if (messageData.type === 'edited') {
                messageInfo = `\`\`\`Channel     - ${channelName}\n` +
                              `Author      - ${messageData.author}\n` +
                              `Old Message - ${messageData.oldContent}\n` +
                              `New Message - ${messageData.newContent}\n` +
                              `Edited At   - ${new Date(messageData.editedAt).toLocaleString()}\n\`\`\``;
            }

            embed.addFields({
                name: `Details for Message from ${messageData.type}`,
                value: messageInfo,
                inline: false
            });

            messagesCount++;
        }

        if (messagesCount === 0) {
            embed.setDescription('No messages to list.');
        }

        message.channel.send({ embeds: [embed] });
    }
};




// Command to clear snipes
module.exports.clearsnipes = {
    name: 'clearsnipes',
    description: 'Clears all stored sniped messages',
    
    run: async (client, message, args) => {
        deletedMessages.clear(); // Clears deleted messages
        editedMessages.clear(); // Clears edited messages
        message.channel.send('All sniped messages have been cleared!');
    }
};
