const { Topokki } = require('../../structures/topokki');
const { CommandInteraction } = require('discord.js');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    'name': 'resume',
    'description': 'Resume playback',
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

        if (!queue.paused) {
            client.reply(interaction, 'Playback is not paused');
            return;
        }

        queue.resume();

        interaction.reply('Done!');
    },
});
