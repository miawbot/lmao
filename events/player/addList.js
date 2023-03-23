const { Playlist, Queue } = require('distube');
const { Topokki } = require('../../structures/bibimbap');
const { Event } = require('../../helpers/event');

module.exports = new Event({
    name: 'addList',
    isPlayer: true,

    /**
     * 
     * @param {Topokki} client 
     * @param {Queue} queue 
     * @param {Playlist} playlist 
     */
    callback(client, queue, playlist) {
        queue.textChannel.send(`added ${client.inline(playlist.songs.length)} songs to queue`);
    },
});
