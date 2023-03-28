const { Topokki } = require('../../structures/topokki');
const { Event } = require('../../helpers/event');

module.exports = new Event({
    'name': 'ready',

    /**
     * 
     * @param {Topokki} client 
     */
    async callback(client) {
        client.registerCommands();

        client.user.setActivity({

        })

        console.log('Commands have been loaded');
    },
});
