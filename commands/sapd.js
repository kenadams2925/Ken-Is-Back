const { EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const { PermissionsBitField } = require('discord.js');

mongoose.connect('mongodb+srv://Amaze:atk3182008@cluster0.pijr5lt.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to the database.');
});

const memberSchema = new mongoose.Schema({
  name: String,
  rank: String,
});

const Member = mongoose.model('Member', memberSchema);

const rankOrder = [
  'Police Commissioner',
  'Deputy Commissioner',
  'Police Chief',
  'Deputy Chief',
  'Major',
  'Commander',
  'Captain',  
  'Lieutenant',
  'Sergeant',
  'Officer III',
  'Officer II',
  'Officer I',
  'Cadet',
];

module.exports = {
  name: 'sapd',
  description: 'Manage SAPD entries.',
  run: async (client, message, args) => {
    const subcommand = args[0];

    if (subcommand === 'add') {
        
      //  if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
       // return message.reply('You do not have permission to use this command.');
       // }

       if (message.author.id !== "936474701000224768") {
        return message.reply('You do not have permission to use this command.');
    }

            const name = args[1];
            const rank = args.slice(2).join(' ');
        
                if (!name) {
                return message.reply(`Syntax: **.sapd add [name] [rank]** \n Please provide a Name and Rank to add`);
                }
                 if (!rankOrder.includes(rank)) {
                 return message.reply(`Syntax: **.sapd add [name] [rank]**.\nPlease use one of the following ranks: ${rankOrder.join(', ')}`);
                 }
        
                     const member = new Member({
                      name,
                      rank,
                       });
                          member.save();
                          message.reply(`Member ${name} with rank ${rank} added.`);
        
        
    } else if (subcommand === 'remove') {
        
    // if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
   // return message.reply('You do not have permission to use this command.');
//    }
          if (message.author.id !== "936474701000224768") {
           return message.reply('You do not have permission to use this command.');
                       }
      const name = args[1];
        
        if (!name) {
        return message.reply('Syntax: **.sapd remove [name]**');
    }

      try {
        const removedMember = await Member.findOneAndDelete({ name });

        if (removedMember) {
          message.reply(`Member ${removedMember.name} with rank ${removedMember.rank} removed.`);
        } else {
          message.reply(`Member ${name} not found.`);
        }
      } catch (error) {
        console.error('Error removing member:', error);
        message.reply('An error occurred while removing the member.');
      }
    } else if (subcommand === 'list') {
      try {
        const members = await Member.find().lean();

        members.sort((a, b) => rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank));

        const embed = new EmbedBuilder()
          .setColor('#0014ff')
          .setTitle('SAPD MEMBERS AND RANKS')
          .setDescription(
            '```\n' +
            members
              .map(member => `${member.rank.padEnd(19, ' ')} - ${member.name.padStart(12, ' ')}`)
              .join('\n\n')
            + '```'
          )
          .setAuthor({
            name: `San Andreas Police Department \n `,
            iconURL: 'https://media.discordapp.net/attachments/961545403717808188/1081181066053820486/images.png',
          })
          .setFooter({
            text: `${message.author.username}`,
          })
          .setTimestamp();

        message.channel.send({ embeds: [embed] });
      } catch (error) {
        console.error('Error fetching members:', error);
        message.reply('An error occurred while fetching members.');
      }
    } else if (subcommand === 'edit') {
        
  //  if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
  //  return message.reply('You do not have permission to use this command.');
   //  }

   if (message.author.id !== "936474701000224768") {
    return message.reply('You do not have permission to use this command.');
}
        
      const name = args[1];
      const newRank = args.slice(2).join(' ');
        
        if (!name) {
        return message.reply(`Syntax: **.sapd edit [name] [new_rank]** \n Please provide a Name to Edit`);
    }
        if(!newRank){
         return message.reply(`Syntax: **.sapd edit [name] [new_rank]** \n Please provide a Rank to Edit`);   
        }

      try {
        const updatedMember = await Member.findOneAndUpdate({ name }, { rank: newRank }, { new: true });

        if (updatedMember) {
          message.reply(`Member ${name} updated. New rank: ${updatedMember.rank}`);
        } else {
          message.reply(`Member ${name} not found.`);
        }
      } catch (error) {
        console.error('Error updating member:', error);
        message.reply('An error occurred while updating the member.');
      }
    }
  },
};
