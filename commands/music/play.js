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
        {
            name: 'skip',
            description: 'skip current song and play requested song instead',
            type: ApplicationCommandOptionType.Boolean,
        }
    ],

    /**
     * 
     * @param {Bibimbap} client 
     * @param {CommandInteraction} interaction 
     */
    async callback(client, interaction) {
        await interaction.deferReply();

        const search = interaction.options.getString('search');
        const skip = interaction.options.getBoolean('skip');

        try {
            client.notification(interaction, `searching ${client.inline(search)}`);

            await client.player.playSong(interaction, search, skip
                ? { skip: true }
                : {}
            );
        } catch (err) {
            client.notification(interaction, 'request is invalid. try a different url or search term');
            return;
        }
    }
});
