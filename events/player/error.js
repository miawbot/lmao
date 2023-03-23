const { Topokki } = require('../../structures/bibimbap');
const { Event } = require('../../helpers/event');

module.exports = new Event({
    name: 'error',
    isPlayer: true,

    /**
     * 
     * @param {Topokki} client 
     */
    callback(client, channel, err) {
        console.log(err);
    },
});
