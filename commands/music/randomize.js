const { CommandInteraction } = require('discord.js');
const Bibimbap = require('../../structs/Bibimbap');
const { Command } = require('../../structs/command');

module.exports = new Command({
    name: 'randomize',
    description: 'randomizes queue',
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

        client.player.randomizeQueue(queue);

        interaction.reply('queue has been randomized');
    },
});
