const { Event } = require('../../../structures/event');
const { DistubeEventType } = require('../../../structures/distube');

module.exports = new Event({
    name: 'addList',
    module_type: new DistubeEventType(),

    run(client, queue, playlist) {
        queue.textChannel.send('added ' + client.inline(playlist.songs.length) + ' songs to queue');
    },
});
