const { EmbedBuilder } = require('discord.js');
const { Event } = require('../../structures/event');


module.exports = new Event(
    {
        name: 'guildMemberAdd',

        async run(client, interaction) {
            const embed = new EmbedBuilder()
                .setColor('#6C78AD')
                .setTitle('welcome to hazels')
                .setDescription(`${client.mention(interaction.user.id)} has joined the server`);

            const channel = await client.getChannelById(interaction, '785928459980767293');

            if (!channel) {
                return;
            }

            channel.send({ embeds: [embed] });
        },
    },
);
