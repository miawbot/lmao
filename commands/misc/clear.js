const { Topokki } = require('../../structures/topokki');
const { ApplicationCommandOptionType, CommandInteraction, inlineCode } = require('discord.js');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    'name': 'clear',
    'description': 'remove a specified amount of messages in a given channel',
    'ownerOnly': true,
    'options': [
        {
            'name': 'amount',
            'description': 'amount of messages to removed',
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
        const amount = interaction.options.getNumber("amount");

        if (amount < 1) {
            client.reply(interaction, 'amount must be greater than zero');
            return;
        }

        if (amount > 100) {
            client.reply(interaction, 'amount must not be greater than 100');
            return;
        }

        await interaction.channel.bulkDelete(amount, true);

        interaction.reply(`i have deleted ${inlineCode(amount)} messages`);
    }
})