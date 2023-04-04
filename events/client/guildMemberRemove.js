const { Topokki } = require('../../structures/topokki');
const { Event } = require('../../helpers/event');
const { GuildMember, EmbedBuilder, userMention } = require('discord.js');

module.exports = new Event({
    'name': 'guildMemberRemove',

    /**
     * 
     * @param {Topokki} client
     * @param {GuildMember} member 
     */
    async callback(client, member) {
        const Leaderboard = client.database.get('leaderboard');
        const Birthday = client.database.get('birthday');

        await Birthday.findOneAndDelete({
            'guildId': member.guild.id,
            'userId': member?.id,
        })

        await Leaderboard.findOneAndDelete({
            'guildId': member.guild.id,
            'userId': member?.id,
        })
    },
});
