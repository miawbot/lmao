const Bibimbap = require('../../structs/Bibimbap');
const { Event } = require('../../structs/event');

module.exports = new Event({
    name: 'error',
    isPlayer: true,

    /**
     * 
     * @param {Bibimbap} client 
     */
    callback(client, channel, err) {
        console.log(err);
    },
});
