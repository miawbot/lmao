const { Topokki } = require('../../structures/topokki');
const { ApplicationCommandOptionType, CommandInteraction, inlineCode } = require('discord.js');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    'name': 'repeat',
    'description': 'Toggle repeat',
    'isPlayer': true,
    'settings': {
        'sharedVoiceChannel': true,
        'voiceChannel': true,
        'queueNotEmpty': true,
    },

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    callback(client, interaction) {
        const queue = client.player.getQueue(interaction.guildId);

        client.player.setRepeatMode(interaction, queue.repeatMode != 1 ? 1 : 0);

        interaction.reply(`I have set the repeat to be on ${inlineCode(queue.repeatMode === 1 ? 'true' : 'false')}`);
    },
});
