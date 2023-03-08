const { Bibimbap } = require('../../structures/bibimbap');
const { ApplicationCommandOptionType, CommandInteraction } = require('discord.js');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    name: 'echo',
    description: 'echoes a command',
    options: [
        {
            name: 'message',
            description: 'none',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    /**
     * 
     * @param {Bibimbap} client 
     * @param {CommandInteraction} interaction 
     */
    callback(client, interaction) {
        const message = interaction.options.getString('message');
        interaction.reply(message);
    }
})