const { Command } = require('../../helpers/command');
const { EmbedBuilder, CommandInteraction, bold } = require('discord.js');
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
        const queued = []
        const current = [];

        for (const [id, song] of queue.songs.slice(0, 10).entries()) {
            const temp = song.name + ' - ' + song.formattedDuration;

            if (id === 0) {
                current = temp;
                continue;
            }

            queued.push(bold(id) + ' - ' + temp);
        }

        const embed = new EmbedBuilder()
            .setTitle('Now Playing')
            .setDescription(current)
            .setFooter({ 'text': (queue.songs.length - 1 || 'No') + ' songs in queue' })
            .setTimestamp()
            .setColor('#1E1F22')
            .addFields({
                'name': 'Next up',
                'value': queued.join('\n\n') || 'None',
            });

        interaction.reply({ 'embeds': [embed] });
    },
});
