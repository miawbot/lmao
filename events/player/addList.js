const { Playlist, Queue } = require('distube');
const { Topokki } = require('../../structures/topokki');
const { Event } = require('../../helpers/event');
const { inlineCode } = require('discord.js');

module.exports = new Event({
    'name': 'addList',
    'isPlayer': true,

    /**
     * 
     * @param {Topokki} client 
     * @param {Queue} queue 
     * @param {Playlist} playlist 
     */
    callback(client, queue, playlist) {
        queue.textChannel.send(`I have added ${inlineCode(playlist.songs.length)} songs to the queue`);
    },
});
