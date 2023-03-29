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
        },
    ],

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    async callback(client, interaction) {
        const amount = interaction.options.getNumber('amount');

        if (amount < 1) {
            client.reply(interaction, 'The amount must be greater than 0');
            return;
        }

        if (amount > 100) {
            client.reply(interaction, 'The amount must be lower than 100');
            return;
        }

        await interaction.channel.bulkDelete(amount, true);

        client.reply(interaction, `I have deleted ${inlineCode(amount)} messages in this channel`);
    }
})