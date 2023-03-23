const { Command } = require('../../helpers/command');
const { EmbedBuilder, CommandInteraction } = require('discord.js');
const { Topokki } = require('../../structures/topokki');

module.exports = new Command({
    name: 'nowplaying',
    description: 'information about current song',
    isPlayer: true,
    settings: {
        sharedVoiceChannel: true,
        voiceChannel: true,
        queueNotEmpty: true,
    },

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    callback(client, interaction) {
        const queue = client.player.getQueue(interaction.guildId);
        const song = queue.songs[0];

        const embed = new EmbedBuilder()
            .setTitle(song.name)
            .setTimestamp()
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
                    value: client.mention('user', song.user.username),
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
