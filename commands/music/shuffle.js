const { CommandInteraction } = require('discord.js');
const { Topokki } = require('../../structures/topokki');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    'name': 'shuffle',
    'description': 'Shuffle the queue',
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

        client.player.shuffleQueue(queue);

        interaction.reply('Done!');
    },
});
