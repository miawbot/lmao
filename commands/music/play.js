const { Bibimbap } = require('../../structures/bibimbap');
const { ApplicationCommandOptionType, CommandInteraction } = require('discord.js');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    name: 'play',
    description: 'play a song',
    isPlayer: true,
    settings: {
        sharedVoiceChannel: true,
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
    async callback(client, interaction) {
        const search = interaction.options.getString('search');
        const voiceChannel = interaction.member.voice.channel;

        try {
            await client.player.play(voiceChannel, search, { textChannel: interaction.channel, member: interaction.member });
            interaction.reply(`searching ${client.inline(search)}`);
        } catch (err) {
            client.notification(interaction, 'request is invalid. try a different url or search term');
        }
    },
});
