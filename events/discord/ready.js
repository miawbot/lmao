const { Event } = require('../../structures/event');


module.exports = new Event(
    {
        name: 'ready',

        async run(client) {
            console.log('ready')

            await client.registerSlashCommands()
        },
    },
);
