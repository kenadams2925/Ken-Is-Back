const { readdirSync } = require('fs');
const { Client, Collection, GatewayIntentBits, Partials, ActivityType, ChannelType, Events, EmbedBuilder } = require('discord.js');
const keep_alive = require('./keep_alive');
const logs = require('./commands/logs.js'); // Import the logs module

const client = new Client({
    failIfNotExists: false,
    partials: [
        Partials.Channel
    ],
    intents: [
        GatewayIntentBits.DirectMessages, // comment or remove this if bot shouldn't receive DM messages
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();
const pCommandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of pCommandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);

    if (command.snipelist) {
        client.commands.set(command.snipelist.name, command.snipelist);
    }

    if (command.clearsnipes) {
        client.commands.set(command.clearsnipes.name, command.clearsnipes);
    }
}


client.once('ready', async () => {
    console.log(`${client.user.username} is ready!`);
    client.user.setActivity(".help", { type: ActivityType.Listening });
    const vgplayerlist = await client.channels.fetch('1374435063084613712')
    vgplayerlist.send('.pu 4'); 
    vgplayerlist.send('.vgp')
   .then((msg) => {
                      msg.delete({ timeout: 2000 });
           });
   //              const vmc = await client.channels.fetch('1275096167570608169');
   //              vmc.send('.pu 4'); 
    //              vmc.send('.mcl')
   //               .then((msg) => {
     //                                msg.delete({ timeout: 2000 });
     //                           });

          logs.startLogging(client);              

});



              // MESSAGE CREATE


client.on('messageCreate', async message => {

    if (message.content.toLowerCase().includes('atk') || message.mentions.has("936474701000224768")) {
        try {
            await message.react('👀');
        } catch (error) {
            console.error('Failed to react to the message:', error);
        }
    }


    if(message.channel.type == ChannelType.DM){
          const channel = await client.channels.fetch('1275095617114476687');
  const embed = new EmbedBuilder();
  embed.setTitle(`Message Sent by ${message.author.tag}`);
  embed.setDescription(`**Message:** ${message.content}`);
  embed.setColor('Yellow');
  embed.setTimestamp();
  embed.setFooter({ text: 'DM Message' });
  channel.send({ embeds: [embed] });
    }
    
    const PREFIX = '.' 

    if(!message.content.toLowerCase().startsWith(PREFIX.toLowerCase())) return;

    const args = message.content.slice(PREFIX.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    try{
        await command.run(client, message, args);

        if(message.channel.type == ChannelType.DM)
            console.log(`[CMD_DM] ${message.author.tag} (${message.author.id}) | ${message.content}`);
        else
            console.log(`[CMD] ${message.guild.name}(${message.guild.id}) | ${message.author.tag}(${message.author.id}) | ${message.content}`);
    }
    catch (error){
        if(message.channel.type == ChannelType.DM)
            console.log(`[CMD_DM_ERR] ${message.author.tag} (${message.author.id}) | ${message.content}`);
        else
            console.log(`[CMD_ERR] ${message.guild.name}(${message.guild.id}) | ${message.author.tag}(${message.author.id}) | ${message.content}`);

        console.error(error);

        message.reply('An error occurred!');
    }
});


                // MESSAGE UPDATE


client.on('messageUpdate', async (oldMessage, newMessage) => {
  if (oldMessage.author.bot) return;
    
    if(oldMessage.channel.type == ChannelType.DM){
          const channel = await client.channels.fetch('1275095617114476687');
  const embed = new EmbedBuilder();
  embed.setAuthor({ name: oldMessage.author.tag, iconURL: oldMessage.author.displayAvatarURL() });
  embed.setTitle('Message Edited in DM Channel');
  embed.setDescription(`**Old Message:** ${oldMessage.content} \n **New Message:** ${newMessage.content}`);
  embed.setColor('Blue');
  embed.setTimestamp();
  embed.setFooter({ text: oldMessage.author.id });
  channel.send({ embeds: [embed] });
    }
    
  else {
  const channel = await client.channels.fetch('1275095581416620083');
  const embed = new EmbedBuilder();

  embed.setAuthor({ name: oldMessage.author.tag, iconURL: oldMessage.author.displayAvatarURL() });
  embed.setURL(oldMessage.url);
  embed.setTitle(`Message Edited in ${oldMessage.channel.name}`);
  embed.setDescription(`**Old Message:** ${oldMessage.content} \n **New Message:** ${newMessage.content}`);
  embed.setColor('Blue');
  embed.setTimestamp();
  embed.setFooter({ text: oldMessage.author.id });
  channel.send({ embeds: [embed] });
  }
         //SNIPE
       if (!oldMessage.author.bot && oldMessage.content !== newMessage.content) {
        const snipeCommand = client.commands.get('snipe');
    if (snipeCommand) snipeCommand.storeEditedMessage(oldMessage, newMessage);
                         }                       
});

             //MESSAGE DELETE


client.on('messageDelete', async (message) => {
    if (message.author.bot) return;

    const snipeCommand = client.commands.get('snipe');
    if (snipeCommand) snipeCommand.storeDeletedMessage(message);

    if (message.partial) {
        message.fetch().then(fullMessage => {
            const snipeCommand = client.commands.get('snipe');
            if (snipeCommand) snipeCommand.storeDeletedMessage(fullMessage);
        }).catch(console.error);
    }
    
    if(message.channel.type == ChannelType.DM){
          const channel = await client.channels.fetch('1275095617114476687');
  const embed = new EmbedBuilder();
  embed.setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() });
  embed.setTitle('Message Deleted in DM Channel');
  embed.setDescription(`**Message:** ${message.content}`);
  embed.setColor('Red');
  embed.setTimestamp();
  embed.setFooter({ text: message.author.id });
  channel.send({ embeds: [embed] });
    }
    else {
  const channel = await client.channels.fetch('1275095581416620083');
  const embed = new EmbedBuilder();
  embed.setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() });
  embed.setTitle(`Message Deleted in ${message.channel.name}`);
  embed.setDescription(`**Message:** ${message.content}`);
  embed.setColor('Red');
  embed.setTimestamp();
  embed.setFooter({ text: message.author.id });
  channel.send({ embeds: [embed] });
    }
});





client.on(Events.InteractionCreate, interaction => {
	if (!interaction.isChatInputCommand()) return;
	console.log(interaction);
});

client.on('warn', console.warn);
client.on('error', console.error);

client.login(process.env.TOKEN);
