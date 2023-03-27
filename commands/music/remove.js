const { Topokki } = require('../../structures/topokki');
const { ApplicationCommandOptionType, CommandInteraction, inlineCode } = require('discord.js');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    'name': 'remove',
    'description': 'remove a song',
    'isPlayer': true,
    'settings': {
        'sharedVoiceChannel': true,
        'voiceChannel': true,
        'queueNotEmpty': true,
    },
    'options': [
        {
            'name': 'index',
            'description': 'specify index of song to remove',
            'type': ApplicationCommandOptionType.Number,
            'required': true,
        },
    ],

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    callback(client, interaction) {
        const index = interaction.options.getNumber('index');

        const songs = client.player.getQueue(interaction.guildId)?.songs || [];
        const song = songs[index];

        if (!song) {
            client.reply(interaction, 'no song was found with this index in the queue');
            return;
        }

        songs.splice(index, 1);

        interaction.reply(`removed ${inlineCode(song.name)} from queue`);
    },
});
