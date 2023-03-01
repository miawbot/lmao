const Bibimbap = require('../../structs/Bibimbap');
const { ApplicationCommandOptionType, CommandInteraction } = require('discord.js');
const { Command } = require('../../structs/command');

module.exports = new Command({
    name: 'repeat',
    description: 'toggle repeat for current song',
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

        client.player.setRepeatMode(interaction, queue.repeatMode != 1 ? 1 : 0);

        interaction.reply(`repeat set to ${client.inline(queue.repeatMode === 1 ? 'true' : 'false')}`);
    },
});
