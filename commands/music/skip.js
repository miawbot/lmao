const { Command } = require('../../structures/command');


module.exports = new Command(
    {
        name: 'skip',
        description: 'skip current song',
        module_type: 'distube',

        run(client, interaction) {
            const queue = client.distube.getQueue(interaction.guildId);

            if (!queue) {
                client.error(interaction, 'no queue available to use this command');

                return;
            }

            client.distube.skipSong(queue);

            interaction.reply('song has been skipped');
        },
    },
);
