const { CommandInteraction } = require('discord.js');
const Bibimbap = require('../../structs/Bibimbap');
const { Command } = require('../../structs/command');

module.exports = new Command({
    name: 'skip',
    description: 'skip current song',
    isPlayer: true,
    settings: {
        sharedVoiceChannel: true,
        voiceChannel: true,
        queueNotEmpty: true,
    },

    /**
     * 
     * @param {Bibimbap} client 
     * @param {CommandInteraction} interaction 
     */
    callback(client, interaction) {
        const queue = client.player.getQueue(interaction.guildId);

        client.player.skipSong(queue);

        interaction.reply('song has been skipped');
    },
});
