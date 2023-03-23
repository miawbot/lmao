const { Topokki } = require('../../structures/topokki');
const { ApplicationCommandOptionType, CommandInteraction } = require('discord.js');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    name: 'clear',
    description: 'remove a specified amount of messages in a given channel',
    ownerOnly: true,
    options: [
        {
            name: 'amount',
            description: 'amount of messages to removed',
            type: ApplicationCommandOptionType.Number,
            required: true,
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
            client.notification(interaction, 'amount must be greater than zero');
            return;
        }

        if (amount > 100) {
            client.notification(interaction, 'amount must not be greater than 100');
            return;
        }

        await interaction.channel.bulkDelete(amount, true);

        await interaction.reply(`i have deleted ${client.inline(amount)} messages`);
    }
})