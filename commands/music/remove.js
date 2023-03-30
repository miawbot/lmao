const { Topokki } = require('../../structures/topokki');
const { ApplicationCommandOptionType, CommandInteraction, inlineCode } = require('discord.js');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    'name': 'remove',
    'description': 'Remove a song from the queue',
    'isPlayer': true,
    'settings': {
        'sharedVoiceChannel': true,
        'voiceChannel': true,
        'queueNotEmpty': true,
    },
    'options': [
        {
            'name': 'position',
            'description': 'Provide a position',
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
        const position = interaction.options.getNumber('position');

        const songs = client.player.getQueue(interaction.guildId)?.songs || [];
        const song = songs[position];

        if (!song) {
            client.reply(interaction, 'Referred song by position does not exist in the queue');
            return;
        }

        songs.splice(position, 1);

        interaction.reply(`I have removed ${inlineCode(song.name)} from the queue`);
    },
});
