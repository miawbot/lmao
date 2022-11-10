const { Event } = require('../../../structures/event');

module.exports = new Event({
    name: 'addList',
    module_type: 'distube',

    run(client, queue, playlist) {
        queue.textChannel.send('added ' + client.inline(playlist.songs.length) + ' songs to queue');
    },
});
