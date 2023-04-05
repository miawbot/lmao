const { Topokki } = require('../../structures/topokki');
const { ApplicationCommandOptionType, CommandInteraction, ChannelType, PermissionFlagsBits } = require('discord.js');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    'name': 'welcome',
    'description': 'Set up welcome messages for newcomers to the server',
    'isCommandCategory': true,
    'isPlayer': true,
    'defaultMemberPermissions': [PermissionFlagsBits.Administrator],
    'options': [
        {
            'type': ApplicationCommandOptionType.SubcommandGroup,
            'name': 'embed',
            'description': 'Manage embed settings',
            'options': [
                {
                    'type': ApplicationCommandOptionType.Subcommand,
                    'name': 'manage',
                    'description': 'Manage embed settings',
                    'options': [
                        {
                            'type': ApplicationCommandOptionType.String,
                            'name': 'title',
                            'description': 'Set a title',
                        },
                        {
                            'type': ApplicationCommandOptionType.String,
                            'name': 'description',
                            'description': 'Set a description',
                        },
                        {
                            'type': ApplicationCommandOptionType.String,
                            'name': 'color',
                            'description': 'Provide a hex value',
                        },
                        {
                            'type': ApplicationCommandOptionType.String,
                            'name': 'image',
                            'description': 'Provide an image url (e.g imgur)',
                        },
                        {
                            'type': ApplicationCommandOptionType.String,
                            'name': 'footer',
                            'description': 'Set a footer',
                        },
                        {
                            'type': ApplicationCommandOptionType.Boolean,
                            'name': 'timestamp',
                            'description': 'Enable or disable timestamp',
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
                },
                {
                    'type': ApplicationCommandOptionType.Subcommand,
                    'name': 'show',
                    'description': 'Show welcome message embed',
                },
            ],
        },
        {
            'type': ApplicationCommandOptionType.SubcommandGroup,
            'name': 'role',
            'description': 'Manage role settings',
            'options': [
                {
                    'type': ApplicationCommandOptionType.Subcommand,
                    'name': 'add',
                    'description': 'Add a new role to be given to newcomers',
                    'options': [
                        {
                            'type': ApplicationCommandOptionType.Role,
                            'name': 'role',
                            'description': 'Provide a role',
                            'required': true,
                        },
                    ],
                },
                {
                    'type': ApplicationCommandOptionType.Subcommand,
                    'name': 'remove',
                    'description': 'Remove a role from welcome roles',
                    'options': [
                        {
                            'type': ApplicationCommandOptionType.Role,
                            'name': 'role',
                            'description': 'Provide a role',
                            'required': true,
                        },
                    ],
                },
                {
                    'type': ApplicationCommandOptionType.Subcommand,
                    'name': 'show',
                    'description': 'Show a list of every welcome role that has been set',
                },
            ],
        },
    ],
});
