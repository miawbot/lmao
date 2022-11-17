const { EmbedBuilder } = require('discord.js');
const { Event } = require('../../structures/event');


module.exports = new Event(
    {
        name: 'guildMemberAdd',

        async run(client, interaction) {
            const embed = new EmbedBuilder()
                .setColor('#2F3136')
                .setTitle('welcome to bibimbap')
                .setDescription(`${ client.mention(interaction.user.id) } has joined the server`);

            const channel = await client.getChannelById(interaction, '1042913998347173891');

            if (!channel) {
                return;
            }

            channel.send({ embeds: [embed] });
        },
    },
);
