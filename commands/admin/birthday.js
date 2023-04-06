const { Topokki } = require('../../structures/topokki');
const { ApplicationCommandOptionType, CommandInteraction, ChannelType } = require('discord.js');
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
        {
            'type': ApplicationCommandOptionType.Subcommand,
            'name': 'channel',
            'description': 'Manage channel settings',
            'options': [
                {
                    'type': ApplicationCommandOptionType.Channel,
                    'name': 'text_channel',
                    'description': 'Provide a text channel',
                    'channel_types': [ChannelType.GuildText],
                },
                {
                    'type': ApplicationCommandOptionType.Boolean,
                    'name': 'is_enabled',
                    'description': 'Enable or disable function',
                },
            ],
        }
    ],

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    async callback(client, interaction) {
        await client.getSubcommand(interaction)?.callback?.(client, interaction);
    }
})