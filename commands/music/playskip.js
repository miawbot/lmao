const { ApplicationCommandOptionType, CommandInteraction } = require('discord.js');
const { Bibimbap } = require('../../structures/bibimbap');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    name: 'playskip',
    description: 'skip the current song and play the requested song',
    isPlayer: true,
    settings: {
        sharedVoiceChannel: true,
        voiceChannel: true,
    },
    options: [
        {
            name: 'search',
            description: 'search a song',
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
        const search = interaction.options.getString('search');

        client.player.playSong(interaction, search, { textChannel: interaction.channel, member: interaction.member, skip: true }, function (err) {
            if (err) {
                client.notification(interaction, 'something went wrong. try again');
                return;
            }

            interaction.reply(`searching ${client.inline(search)}`);
        })
    },
});
