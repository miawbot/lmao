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
    async callback(client, interaction) {
        const query = interaction.options.getString('search');
        
        client.player.play(interaction.member.voice.channel, query, {
            textChannel: interaction.channel,
            member: interaction.member,
            skip: true,
        });

        interaction.reply(`searching ${client.inline(query)}`);
    },
});
