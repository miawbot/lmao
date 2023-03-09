const { Bibimbap } = require('../../structures/bibimbap');
const { Event } = require('../../helpers/event');

module.exports = new Event({
    name: 'voiceStateUpdate',

    /**
     * 
     * @param {Bibimbap} client 
     */
    callback(client, old, current) {
        const TemporaryVoiceChannel = client.database.get('temporaryVoiceChannel');

        TemporaryVoiceChannel.findOne({ guildId: old.guild.id || current.guild.id }, function (err, doc) {
            if (err) return;

            if (!doc || !doc.isEnabled) {
                return
            };

            if (current?.channelId === doc.channelId) {
                const member = current.member;

                const voiceChannel = member.guild.channels.create({
                    name: `${member.user.username}'s channel`,
                    parent: current.channel?.parentId || null,
                    type: 2
                });

                voiceChannel.then((channel) => {
                    client.voiceChannelCache.set(channel.id, member);
                    member.voice.setChannel(channel.id);
                })
            }

            if (
                client.voiceChannelCache.get(old.channelId) &&
                !old.channel.members.size
            ) {
                old.channel.delete();
            }
        })
    },
});
