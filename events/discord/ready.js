const { Event } = require('../../structures/event');


module.exports = new Event(
    {
        name: 'ready',

        run(client) {
            client
                .registerSlashCommands()
                .then(
                    () => {
                        console.log('slash commands loaded');
                    },
                );
        },
    },
);
