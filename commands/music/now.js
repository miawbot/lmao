const { Command } = require('../../structures/command');
const { EmbedBuilder } = require('discord.js');

module.exports = new Command({
    name: 'now',
    description: 'information about current song',
    module_type: 'distube',

    async run(client, interaction) {
        const queue = client.distube.getQueue(interaction.guildId);

        if (!queue) {
            client.error(interaction, 'no queue available to use this command');

            return;
        }

        const song = queue.songs[0];

        const embed = new EmbedBuilder()
            .setTitle(song.name)
            .setTimestamp()
            .setColor('#6C78AD')
            .setFields(
                {
                    name: 'channel',
                    value: song.uploader.name,
                    inline: true,
                },
                {
                    name: 'song duration',
                    value: `${queue.formattedCurrentTime}/${song.formattedDuration}`,
                    inline: true,
                },
                {
                    name: 'requested by',
                    value: song.user.username,
                    inline: true,
                },
                {
                    name: 'next up',
                    value: queue.songs[1]?.name || 'none',
                    inline: true,
                },
            );

        interaction.reply({ embeds: [embed] });
    },
});
