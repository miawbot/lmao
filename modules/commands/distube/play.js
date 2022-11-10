const discord = require('discord.js');
const { Command } = require('../../../structures/command');
const { DistubeType } = require('../../../structures/distube');

module.exports = new Command({
    name: 'play',
    description: 'play a song',
    module_type: new DistubeType({
        require_shared_voice_channel: false,
    }),
    options: [
        {
            name: 'search',
            description: 'search a song',
            type: discord.ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    run(client, interaction) {
        const search = interaction.options.getString('search');

        client.distube.playSong(interaction, search);

        interaction.reply('searching ' + client.inline(search));
    },
});
