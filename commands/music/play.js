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
    callback(client, interaction) {
        const search = interaction.options.getString('search');
        
        client.player.playSong(interaction, search);

        interaction.reply(`searching ${client.inline(search)}`);
    },
});
