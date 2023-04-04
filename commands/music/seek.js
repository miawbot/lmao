const { Topokki } = require('../../structures/topokki');
const { CommandInteraction, ApplicationCommandOptionType } = require('discord.js');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    'name': 'seek',
    'description': 'Continue playback using the provided timestamp',
    'isPlayer': true,
    'settings': {
        'sharedVoiceChannel': true,
        'voiceChannel': true,
        'queueNotEmpty': true,
    },
    'options': [
        {
            'name': 'seconds',
            'description': 'Seconds',
            'type': ApplicationCommandOptionType.Number,
            'required': true,
        },
        {
            'name': 'minutes',
            'description': 'Minutes',
            'type': ApplicationCommandOptionType.Number,
        },
        {
            'name': 'hours',
            'description': 'Hours',
            'type': ApplicationCommandOptionType.Number,
        },
    ],

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    callback(client, interaction) {
        const options = client.sanitize({
            'seconds': interaction.options.getNumber('seconds'),
            'minutes': interaction.options.getNumber('minutes') || 0,
            'hours': interaction.options.getNumber('hours') || 0,
        });

        client.player.seek(interaction, (options.hours * 3600) + (options.minutes * 60) + options.seconds);

        interaction.reply('Done!');
    },
});
