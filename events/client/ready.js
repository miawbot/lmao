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
        await client.registerCommands();
        client.user.setActivity('VALORANT', { type: ActivityType.Streaming })
        console.log('Commands have been loaded');
    },
});
