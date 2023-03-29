const { Command } = require('../../helpers/command');
const { EmbedBuilder, CommandInteraction } = require('discord.js');
const { Topokki } = require('../../structures/topokki');

module.exports = new Command({
    'name': 'queue',
    'description': 'Show a list of songs in queue',
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
    async callback(client, interaction) {
        const queue = client.player.getQueue(interaction.guildId);
        const songs = { 'queued': [] };

        for (const [id, song] of queue.songs.slice(0, 10).entries()) {
            if (id === 0) {
                songs.current = `[${song.name}](${song.url}) - ${song.formattedDuration}`;
                continue;
            }

            songs.queued.push(`**${id}** - [${song.name}](${song.url}) - ${song.formattedDuration}`);
        }

        const embed = new EmbedBuilder()
            .setTitle('Now Playing')
            .setDescription(songs.current)
            .setFooter({ 'text': `${queue.songs.length - 1 || 'No'} songs in queue` })
            .setTimestamp()
            .setColor('#ffc9b9')
            .addFields({
                'name': 'Next up',
                'value': songs.queued.join('\n\n') || 'None',
            });

        interaction.reply({ 'embeds': [embed] });
    },
},
);
