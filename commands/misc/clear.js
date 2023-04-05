const { Topokki } = require('../../structures/topokki');
const { ApplicationCommandOptionType, CommandInteraction, inlineCode, PermissionFlagsBits } = require('discord.js');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    'name': 'clear',
    'description': 'Remove messages in the current channel',
    'defaultMemberPermissions': [
        PermissionFlagsBits.Administrator,
        PermissionFlagsBits.ManageMessages
    ],
    'options': [
        {
            'name': 'amount',
            'description': 'Provide an amount',
            'type': ApplicationCommandOptionType.Number,
            'required': true,
            'min_value': 1,
            'max_value': 100,
        },
    ],

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    async callback(client, interaction) {
        const amount = interaction.options.getNumber('amount');

        await interaction.channel.bulkDelete(amount, true);

        client.reply(interaction, `I have deleted ${inlineCode(amount)} messages in this channel`);
    }
})