const Bibimbap = require('../../structs/Bibimbap');
const { CommandInteraction } = require('discord.js');
const { Command } = require('../../structs/command');

module.exports = new Command({
    name: 'resume',
    description: 'resume a paused queue',
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

        if (!queue.paused) {
            client.userOnly(interaction, 'queue is not paused');
            return;
        }

        queue.resume();

        interaction.reply('queue has been resumed');
    },
});
