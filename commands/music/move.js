const discord = require('discord.js');
const { Command } = require('../../structures/command');


module.exports = new Command(
    {
        name: 'move',
        description: 'move a song to top',
        module_type: 'distube',

        options: [
            {
                name: 'id',
                description: 'give a song id',
                type: discord.ApplicationCommandOptionType.Number,
                required: true,
            },
        ],

        run(client, interaction) {
            const queue = client.distube.getQueue(interaction.guildId);
            const id = interaction.options.getNumber('id');

            if (!queue) {
                client.error(interaction, 'no queue available to use this command');

                return;
            }

            const songs = queue.songs;
            const song = songs[id];

            if (!song) {
                client.error(interaction, 'no song was found with this index in the queue');

                return;
            }

            songs.splice(id, 1);
            songs.splice(1, 0, song);

            interaction.reply(`moved ${client.inline(song.name)} to first position in the queue`);
        },
    },
);
