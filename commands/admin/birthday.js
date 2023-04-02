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
                    'description': 'Set a birthday date',
                },
                {
                    'type': ApplicationCommandOptionType.Boolean,
                    'name': 'is_public',
                    'description': 'Decide whether others can see your birthday or not',
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
                    'name': 'member',
                    'description': 'Provide a member',
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