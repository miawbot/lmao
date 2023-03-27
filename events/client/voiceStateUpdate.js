const { Topokki } = require('../../structures/topokki');
const { Event } = require('../../helpers/event');

module.exports = new Event({
    'name': 'voiceStateUpdate',

    /**
     * 
     * @param {Topokki} client 
     */
    async callback(client, old, current) {
        const temp = await client.database
            .get('temporaryVoiceChannel')
            .findOne({ 'guildId': old.guild.id || current.guild.id });

        if (
            !temp ||
            !temp.isEnabled
        ) {
            return;
        };

        if (current?.channelId === temp.channelId) {
            const member = current.member;

            const channel = await member.guild.channels.create({
                'name': `${member.user.username}'s channel`,
                'parent': current.channel?.parentId || null,
                'type': 2
            });

            client.voiceChannelCache.set(channel.id, member);
            member.voice.setChannel(channel.id);
            return;
        }

        if (
            client.voiceChannelCache.get(old.channelId) &&
            !old.channel.members.size
        ) {
            old.channel.delete();
            return;
        }
    },
});
