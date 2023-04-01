const { Topokki } = require('../../structures/topokki');
const { Event } = require('../../helpers/event');
const { ChannelType } = require('discord.js');

module.exports = new Event({
    'name': 'voiceStateUpdate',

    /**
     * 
     * @param {Topokki} client 
     */
    async callback(client, old, current) {
        const tempChannel = await client.database
            .get('temporary.voicechannel')
            .findOne({ 'guildId': old.guild.id || current.guild.id });

        if (
            !tempChannel ||
            !tempChannel.isEnabled
        ) {
            return;
        };

        if (current?.channelId === tempChannel.channelId) {
            const member = current.member;

            const channel = await member.guild.channels.create({
                'name': tempChannel.defaultName.replace(/{member}/gi, member.user.username),
                'parent': current.channel?.parentId || null,
                'type': ChannelType.GuildVoice
            });

            client.voiceChannelCache.set(channel.id, member);
            member.voice.setChannel(channel.id);
        }

        if (
            client.voiceChannelCache.get(old.channelId) &&
            !old.channel.members.size
        ) {
            old.channel.delete();
        }
    },
});
