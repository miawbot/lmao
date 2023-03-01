const Bibimbap = require('../../structs/Bibimbap');
const { ApplicationCommandOptionType, CommandInteraction } = require('discord.js');
const { Command } = require('../../structs/command');

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
     * @param {Bibimbap} client 
     * @param {CommandInteraction} interaction 
     */
    callback(client, interaction) {
        const amount = interaction.options.getNumber("amount");

        if (amount < 1) {
            client.userOnly(interaction, 'amount must be greater than zero');
            return;
        }

        if (amount > 100) {
            client.userOnly(interaction, 'amount must not be greater than 100');
            return;
        }

        interaction.channel.bulkDelete(amount, true);

        interaction.reply(`i have deleted ${client.inline(amount)} messages`);
    }
})