const { Topokki } = require('../../structures/topokki');
const { Event } = require('../../helpers/event');
const { Message } = require('discord.js');

module.exports = new Event({
    'name': 'messageCreate',

    /**
     * 
     * @param {Topokki} client 
     * @param {Message} message
     */
    async callback(client, message) {
        const Leaderboard = client.database.get('leaderboard');

        if (!client.botPreventionCache.get(message.member.id)) {
            client.botPreventionCache.set(message.member.id, true);
        }

        if (
            message.author.id === client.user.id ||
            message.author.bot
        ) {
            return;
        }

        const member = await Leaderboard.findOne({
            'guildId': message.guildId,
            'userId': message.member.id
        });

        if (!member) {
            await Leaderboard.create({
                'guildId': message.guildId,
                'userId': message.member.id,
                'lastActive': Date.now()
            })

            return;
        }

        const minutes = Math.floor((Date.now() - member.lastActive) / 60000);

        if (minutes >= 5) {
            await Leaderboard.findOneAndUpdate(
                {
                    'guildId': message.guildId,
                    'userId': message.member.id,
                },
                {
                    '$inc': { 'points': 1, },
                    '$set': { 'lastActive': Date.now() }
                }
            )
        }
    },
});
