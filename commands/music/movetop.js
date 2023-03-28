const { Topokki } = require('../../structures/topokki');
const { ApplicationCommandOptionType, CommandInteraction, inlineCode } = require('discord.js');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    'name': 'movetop',
    'description': 'Move requested song to the first position in the queue',
    'isPlayer': true,
    'settings': {
        'sharedVoiceChannel': true,
        'voiceChannel': true,
        'queueNotEmpty': true,
    },
    'options': [
        {
            'name': 'index',
            'description': 'Provide an index',
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
            client.reply(interaction, 'Referred song by index does not exist in the queue');
            return;
        }

        songs.splice(index, 1);
        songs.splice(1, 0, song);

        interaction.reply(`I have moved ${inlineCode(song.name)} to the first position in the queue!`);
    },
});
