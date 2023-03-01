const Bibimbap = require('../../structs/Bibimbap');
const { Event } = require('../../structs/event');

module.exports = new Event({
    name: 'ready',

    /**
     * 
     * @param {Bibimbap} client 
     * @param {CommandInteraction} interaction 
     */
    callback(client) {
        client.registerCommands().then(() => console.log('loaded commands'));
    },
});
