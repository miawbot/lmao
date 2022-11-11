const { Command } = require('../../structures/command');


module.exports = new Command(
    {
        name: 'shuffle',
        description: 'shuffles queue',
        module_type: 'distube',

        async run(client, interaction) {
            const queue = client.distube.getQueue(interaction.guildId);

            if (!queue) {
                client.error(interaction, 'no queue available to use this command');

                return;
            }

            await client.distube.shuffleQueue(queue);

            interaction.reply('queue has been shuffled');
        },
    },
);
