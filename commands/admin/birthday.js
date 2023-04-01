const { Topokki } = require('../../structures/topokki');
const { ApplicationCommandOptionType, CommandInteraction, ChannelType, PermissionFlagsBits } = require('discord.js');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    'name': 'birthday',
    'description': 'Set up your birthday information',
    'options': [
        {
            'type': ApplicationCommandOptionType.Subcommand,
            'name': 'manage',
            'description': 'Manage birthday settings',
            'options': [
                {
                    'type': ApplicationCommandOptionType.String,
                    'name': 'date',
                    'description': 'Set a date',
                },
                {
                    'type': ApplicationCommandOptionType.Boolean,
                    'name': 'is_enabled',
                    'description': 'Enable/disable',
                },
            ],
        },
        {
            'type': ApplicationCommandOptionType.Subcommand,
            'name': 'show',
            'description': 'Show birthday of a member',
            'options': [
                {
                    'type': ApplicationCommandOptionType.User,
                    'name': 'user',
                    'description': 'Provide an user',
                    'required': true
                },
            ],
        },
    ],

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    async callback(client, interaction) {
        const subcommand = client.getSubcommand(interaction);

        if (subcommand) {
            await subcommand.callback?.(client, interaction);
        }
    }
})