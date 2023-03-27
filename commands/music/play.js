const { Topokki } = require('../../structures/topokki');
const { ApplicationCommandOptionType, CommandInteraction, inlineCode } = require('discord.js');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    'name': 'play',
    'description': 'play a song',
    'isPlayer': true,
    'settings': {
        'sharedVoiceChannel': true,
        'voiceChannel': true,
    },
    'options': [
        {
            'name': 'search',
            'description': 'search a song',
            'type': ApplicationCommandOptionType.String,
            'required': true,
        },
        {
            'name': 'skip',
            'description': 'skip current song and play requested song instead',
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

        client.reply(interaction, `searching ${inlineCode(search)}`);

        try {
            await client.player.playSong(interaction, search, skip ? { 'skip': true } : {});
        } catch (err) {
            client.reply(interaction, 'hmm something went wrong. maybe try again?');
            return;
        }
    }
});
