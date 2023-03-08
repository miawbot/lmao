const { Bibimbap } = require('../../structures/bibimbap');
const { CommandInteraction } = require('discord.js');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    name: 'pause',
    description: 'pause playback',
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

        if (queue.paused) {
            client.notification(interaction, 'queue is already paused');
            return;
        }

        client.player.pause(interaction.guildId);

        interaction.reply('queue has been paused');
    },
});
