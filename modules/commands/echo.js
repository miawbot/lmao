const discord = require('discord.js');
const { Command } = require('../../structures/command');
const { ClientType } = require('../../structures/client');

module.exports = new Command({
    name: 'echo',
    description: 'echoes a message',
    module_type: new ClientType(),
    options: [
        {
            name: 'message',
            description: 'none',
            type: discord.ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    run(client, interaction) {
        const message = interaction.options.getString('message');

        interaction.reply(message);
    },
});