const { ApplicationCommandOptionType, CommandInteraction } = require('discord.js');
const Bibimbap = require('../../structs/Bibimbap');
const { Command } = require('../../structs/command');

module.exports = new Command({
    name: 'playskip',
    description: 'skip the current song and play the requested song',
    isPlayer: true,
    settings: {
        sharedVoiceChannel: true,
        voiceChannel: true,
    },
    options: [
        {
            name: 'search',
            description: 'search a song',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    /**
     * 
     * @param {Bibimbap} client 
     * @param {CommandInteraction} interaction 
     */
    async callback(client, interaction) {
        const search = interaction.options.getString('search');

        await client.player.playSong(interaction, search);

        const queue = client.player.getQueue(interaction.guildId);
        const songs = queue.songs;
        const id = songs.length - 1;
        const song = songs[id];

        songs.splice(id, 1);
        songs.splice(1, 0, song);

        client.player.skipSong(queue);

        interaction.reply(`searching ${client.inline(search)}`);
    },
});
