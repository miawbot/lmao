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
        await interaction.deferReply();

        const search = interaction.options.getString('search');

        client.player.playSong(interaction, search, {}, async (err) => {
            if (err) {
                await client.notification(interaction, 'request is invalid. try a different url or search term');
                return;
            }

            await interaction.editReply(`searching ${client.inline(search)}`);
        });
    }
});
