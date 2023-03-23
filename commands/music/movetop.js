const { Topokki } = require('../../structures/bibimbap');
const { ApplicationCommandOptionType, CommandInteraction } = require('discord.js');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    name: 'movetop',
    description: 'move requested song to first position in queue',
    isPlayer: true,
    settings: {
        sharedVoiceChannel: true,
        voiceChannel: true,
        queueNotEmpty: true,
    },
    options: [
        {
            name: 'index',
            description: 'provide a song index',
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
    ],

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    callback(client, interaction) {
        const index = interaction.options.getNumber('index');

        const songs = client.player.getQueue(interaction.guildId)?.songs ?? [];
        const song = songs[index];

        if (!song) {
            client.userOnly(interaction, 'no song was found with this index in the queue');
            return;
        }

        songs.splice(index, 1);
        songs.splice(1, 0, song);

        interaction.reply(`moved ${client.inline(song.name)} to first position in the queue`);
    },
});
