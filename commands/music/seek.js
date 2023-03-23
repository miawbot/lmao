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
        const seconds = interaction.options.getNumber('seconds');
        const minutes = interaction.options.getNumber('minutes') || 0;
        const hours = interaction.options.getNumber('hours') || 0;

        client.player.seek(interaction, (hours * 3600) + (minutes * 60) + seconds);

        interaction.reply('song has been seeked to timestamp');
    },
});
