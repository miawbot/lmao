const { CommandInteraction } = require('discord.js');
const { Topokki } = require('../../structures/topokki');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    'name': 'stop',
    'description': 'stop queue and leave voice channel',
    'isPlayer': true,

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    callback(client, interaction) {
        const queue = client.player.getQueue(interaction.guildId);

        if (queue) {
            queue.stop();
        }

        interaction.reply('Done!');
    },
});
