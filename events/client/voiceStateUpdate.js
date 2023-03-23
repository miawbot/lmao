const { Topokki } = require('../../structures/topokki');
const { Event } = require('../../helpers/event');

module.exports = new Event({
    name: 'voiceStateUpdate',

    /**
     * 
     * @param {Topokki} client 
     */
    async callback(client, old, current) {
        const tvc = await client.database
            .get('temporaryVoiceChannel')
            .findOne({ guildId: old.guild.id || current.guild.id });

        if (
            !tvc ||
            !tvc.isEnabled
        ) {
            return
        };

        if (current?.channelId === tvc.channelId) {
            const member = current.member;

            const vc = await member.guild.channels.create({
                name: `${member.user.username}'s channel`,
                parent: current.channel?.parentId || null,
                type: 2
            });

            client.voiceChannelCache.set(vc.id, member);
            
            member.voice.setChannel(vc.id);
        }

        if (
            client.voiceChannelCache.get(old.channelId) &&
            !old.channel.members.size
        ) {
            old.channel.delete();
        }
    },
});
