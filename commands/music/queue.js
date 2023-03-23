const { Command } = require('../../helpers/command');
const { EmbedBuilder, CommandInteraction } = require('discord.js');
const { Topokki } = require('../../structures/bibimbap');

module.exports = new Command({
    name: 'queue',
    description: 'get queue',
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
    async callback(client, interaction) {
        await interaction.deferReply()

        const queue = client.player.getQueue(interaction.guildId);
        const songs = { queued: [] };

        for (const [id, song] of queue.songs.entries()) {
            if (id === 0) {
                songs.current = `${song.name} - ${song.formattedDuration}`;
                continue;
            }

            songs.queued.push(`**${id}** - ${song.name} - ${song.formattedDuration}`);
        }

        const embed = new EmbedBuilder()
            .setTitle('now playing')
            .setDescription(songs.current)
            .setFooter({ text: `${queue.songs.length - 1 || 'no'} songs in queue` })
            .setTimestamp()
            .addFields(
                {
                    name: 'next up',
                    value: songs.queued.slice(0, 10).join('\n\n') || 'none',
                },
            );

        await interaction.editReply({ embeds: [embed] });
    },
},
);
