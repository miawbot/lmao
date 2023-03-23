const { Topokki } = require('../../structures/bibimbap');
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
