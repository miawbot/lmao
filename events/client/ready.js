const { Bibimbap } = require('../../structures/bibimbap');
const { Event } = require('../../helpers/event');

module.exports = new Event({
    name: 'ready',

    /**
     * 
     * @param {Bibimbap} client 
     */
    callback(client) {
        client.registerCommands().then(() => console.log('loaded commands'));
    },
});
