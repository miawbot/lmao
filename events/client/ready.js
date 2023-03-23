const { Topokki } = require('../../structures/topokki');
const { Event } = require('../../helpers/event');

module.exports = new Event({
    name: 'ready',

    /**
     * 
     * @param {Topokki} client 
     */
    callback(client) {
        client.registerCommands().then(() => console.log('loaded commands'));
    },
});
