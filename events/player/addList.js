const { Playlist, Queue } = require('distube');
const Bibimbap = require('../../structs/Bibimbap');
const { Event } = require('../../structs/event');

module.exports = new Event({
    name: 'addList',
    isPlayer: true,

    /**
     * 
     * @param {Bibimbap} client 
     * @param {Queue} queue 
     * @param {Playlist} playlist 
     */
    callback(client, queue, playlist) {
        queue.textChannel.send(`added ${client.inline(playlist.songs.length)} songs to queue`);
    },
});
