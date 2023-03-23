const { Topokki } = require('../../structures/topokki');
const { CommandInteraction, ApplicationCommandOptionType } = require('discord.js');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    name: 'seek',
    description: 'seek timestamp in song',
    isPlayer: true,
    settings: {
        sharedVoiceChannel: true,
        voiceChannel: true,
        queueNotEmpty: true,
    },
    options: [
        {
            name: 'seconds',
            description: 'provide a timestamp',
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: 'minutes',
            description: 'provide a timestamp',
            type: ApplicationCommandOptionType.Number,
        },
        {
            name: 'hours',
            description: 'provide a timestamp',
            type: ApplicationCommandOptionType.Number,
        },
    ],

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    callback(client, interaction) {
        const options = client.getOptions(interaction, ['seconds', 'minutes', 'hours'])

        for (const [key, value] of Object.entries(options)) {
            options[key] = value || 0;
        }

        client.player.seek(interaction, (options.hours * 3600) + (options.minutes * 60) + options.seconds);

        interaction.reply('song has been seeked to timestamp');
    },
});
