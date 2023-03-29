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
        console.log('Commands have been loaded');
        
        client.user.setActivity('VALORANT VCT', { 'type': ActivityType.Competing })
    },
});
