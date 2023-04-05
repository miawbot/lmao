const { Topokki } = require('../../structures/topokki');
const { CommandInteraction, EmbedBuilder, bold, ApplicationCommandOptionType } = require('discord.js');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    'name': 'leaderboard',
    'description': 'Most active members of this server',
    'isCommandCategory': true,
    'options': [
        {
            'type': ApplicationCommandOptionType.Subcommand,
            'name': 'remove',
            'description': 'Remove a leaderboard score',
            'options': [
                {
                    'type': ApplicationCommandOptionType.User,
                    'name': 'member',
                    'description': 'Provide a member',
                    'required': true,
                },
            ]
        },
        {
            'type': ApplicationCommandOptionType.Subcommand,
            'name': 'show',
            'description': 'Show leaderboard',
        }
    ],
})
