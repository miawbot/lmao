const { Topokki } = require('../../structures/topokki');
const { ApplicationCommandOptionType, CommandInteraction, inlineCode } = require('discord.js');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    'name': 'play',
    'description': 'Request a song to be added to the queue',
    'isPlayer': true,
    'settings': {
        'sharedVoiceChannel': true,
        'voiceChannel': true,
    },
    'options': [
        {
            'name': 'search',
            'description': 'Provide search terms or a url',
            'type': ApplicationCommandOptionType.String,
            'required': true,
        },
        {
            'name': 'skip',
            'description': 'Skip the current song and the play requested song instead',
            'type': ApplicationCommandOptionType.Boolean,
        }
    ],

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    async callback(client, interaction) {
        await interaction.deferReply();

        const search = interaction.options.getString('search');
        const skip = interaction.options.getBoolean('skip');

        client.reply(interaction, `Searching ${inlineCode(search)}`);

        try {
            await client.player.playSong(interaction, search, skip ? { 'skip': true } : {});
        } catch (err) {
            client.reply(interaction, 'I could not process this request, please try again');
            return;
        }
    }
});
