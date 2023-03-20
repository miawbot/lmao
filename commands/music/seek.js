const { Bibimbap } = require('../../structures/bibimbap');
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
            name: 'timestamp',
            description: 'provide a timestamp',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    /**
     * 
     * @param {Bibimbap} client 
     * @param {CommandInteraction} interaction 
     */
    callback(client, interaction) {
        const timestamp = interaction.options.getString('timestamp');
        const regex = new RegExp('^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$');
        const seconds = (new Date(timestamp)).getSeconds();


        console.log(seconds, !regex.test(timestamp))

        if (!regex.test(timestamp)) {
            client.notification(interaction, 'timestamp is invalid')
            return;
        }

        client.player.seek(seconds);

        interaction.reply('queue has been paused');
    },
});
