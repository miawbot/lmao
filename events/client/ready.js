const { Topokki } = require('../../structures/topokki');
const { Event } = require('../../helpers/event');
const { ActivityType } = require('discord.js');

module.exports = new Event({
    'name': 'ready',

    /**
     * 
     * @param {Topokki} client 
     */
    async callback(client) {
        client.registerCommands().then(() => console.log('Commands have been loaded'));

        client.user.setActivity('the clouds :)', { 'type': ActivityType.Watching })
    },
});
