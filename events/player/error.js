const { Bibimbap } = require('../../structures/bibimbap');
const { Event } = require('../../helpers/event');

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
