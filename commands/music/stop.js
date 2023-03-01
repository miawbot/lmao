const { CommandInteraction } = require('discord.js');
const Bibimbap = require('../../structs/Bibimbap');
const { Command } = require('../../structs/command');

module.exports = new Command({
    name: 'stop',
    description: 'stop queue and leave voice channel',
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
    async callback(client, interaction) {
        const queue = client.player.getQueue(interaction.guildId);

        await queue.stop();

        interaction.reply('song has been skipped');
    },
});
