const Bibimbap = require('../../structs/Bibimbap');
const { ApplicationCommandOptionType, CommandInteraction } = require('discord.js');
const { Command } = require('../../structs/command');

module.exports = new Command({
    name: 'remove',
    description: 'remove a song',
    isPlayer: true,
    settings: {
        sharedVoiceChannel: true,
        voiceChannel: true,
        queueNotEmpty: true,
    },
    options: [
        {
            name: 'index',
            description: 'specify index of song to remove',
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
    ],

    /**
     * 
     * @param {Bibimbap} client 
     * @param {CommandInteraction} interaction 
     */
    callback(client, interaction) {
        const index = interaction.options.getNumber('index');

        const songs = client.player.getQueue(interaction.guildId)?.songs ?? [];
        const song = songs[index];

        if (!song) {
            client.userOnly('no song was found with this index in the queue');
            return;
        }

        songs.splice(index, 1);

        interaction.reply(`removed ${client.inline(song.name)} from queue`);
    },
});