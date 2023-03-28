const { Topokki } = require('../../structures/topokki');
const { ApplicationCommandOptionType, CommandInteraction } = require('discord.js');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    'name': 'echo',
    'description': 'Echo a message',
    'options': [
        {
            'name': 'message',
            'description': 'Provide a message',
            'type': ApplicationCommandOptionType.String,
            'required': true,
        },
    ],

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    callback(client, interaction) {
        interaction.reply(interaction.options.getString('message'));
    }
})