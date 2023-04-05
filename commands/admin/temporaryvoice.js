const { Topokki } = require('../../structures/topokki');
const { ApplicationCommandOptionType, CommandInteraction, ChannelType, PermissionFlagsBits } = require('discord.js');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    'name': 'temporaryvoice',
    'description': 'Set up temporary voice channels',
    'isCommandCategory': true,
    'options': [
        {
            'type': ApplicationCommandOptionType.Subcommand,
            'name': 'customize',
            'description': 'Customize personal settings',
            'options': [
                {
                    'type': ApplicationCommandOptionType.String,
                    'name': 'name',
                    'description': 'Change personal channel name',
                },
                {
                    'type': ApplicationCommandOptionType.String,
                    'name': 'max_slots',
                    'description': 'Change amount of slots set in personal channel',
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
                    'name': 'voice_channel',
                    'description': 'Provide a voice channel',
                    'channel_types': [ChannelType.GuildVoice],
                },
                {
                    'type': ApplicationCommandOptionType.Boolean,
                    'name': 'is_enabled',
                    'description': 'Enable or disable function',
                },
            ],
        }
    ],
})