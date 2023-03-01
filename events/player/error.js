const { Event } = require('../../structs/event');

module.exports = new Event({
    name: 'error',
    isPlayer: 'distube',

    /**
     * 
     * @param {Bibimbap} client 
     */
    callback(client, channel, err) {
        console.log(err);
    },
});
