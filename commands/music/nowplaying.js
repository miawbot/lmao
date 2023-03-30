const { Command } = require('../../helpers/command');
const { EmbedBuilder, CommandInteraction, userMention } = require('discord.js');
const { Topokki } = require('../../structures/topokki');

module.exports = new Command({
    'name': 'nowplaying',
    'description': 'Get information about the current song',
    'isPlayer': true,
    'settings': {
        'sharedVoiceChannel': true,
        'voiceChannel': true,
        'queueNotEmpty': true,
    },

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    callback(client, interaction) {
        const queue = client.player.getQueue(interaction.guildId);
        const song = queue.songs[0];
        const nextUp = queue.songs[1];

        const embed = new EmbedBuilder()
            .setTitle(song.name)
            .setTimestamp()
            .setColor('#1E1F22')
            .setFields(
                {
                    'name': 'By',
                    'value': song.uploader.name,
                    'inline': true,
                },
                {
                    'name': 'Song duration',
                    'value': `${queue.formattedCurrentTime}/${song.formattedDuration}`,
                    'inline': true,
                },
                {
                    'name': 'Requested by',
                    'value': song.user.tag,
                    'inline': true,
                },
                {
                    'name': 'Next up',
                    'value': nextUp ? nextUp.name : 'None',
                    'inline': true,
                },
            );

        interaction.reply({ 'embeds': [embed] });
    },
});
