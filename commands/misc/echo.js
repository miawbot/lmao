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
        {
            'name': 'hidden',
            'description': 'Set reply to be anonymous',
            'type': ApplicationCommandOptionType.Boolean,
        }
    ],

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    callback(client, interaction) {
        const message = interaction.options.getString('message');
        const hidden = interaction.options.getBoolean('hidden') || false;

        if (hidden) {
            interaction.deferReply();
            interaction.deleteReply();
            
            interaction.channel.send(message);
            return;
        }

        interaction.reply(message);
    }
})