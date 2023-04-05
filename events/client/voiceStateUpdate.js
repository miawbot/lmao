const { Topokki } = require('../../structures/topokki');
const { Event } = require('../../helpers/event');
const { ChannelType, GuildMember, Guild } = require('discord.js');

module.exports = new Event({
    'name': 'voiceStateUpdate',

    /**
     * 
     * @param {Topokki} client 
     */
    async callback(client, old, current) {
        const CustomVoiceChannel = client.database.get('customvoicechannel');
        const TemporaryVoiceChannel = client.database.get('temporary.voicechannel');

        const guild = old.guild || current.guild;
        const member = old.member || current.member;

        if (!client.botPreventionCache.get(member?.id)) {
            client.botPreventionCache.set(member?.id, true);
        }

        const setting = await TemporaryVoiceChannel.findOne({ 'guildId': guild.id });

        let custom = await CustomVoiceChannel.findOne({
            'guildId': guild.id,
            'userId': member.id
        });

        if (!custom?.name) {
            custom = await CustomVoiceChannel.findOneAndUpdate(
                {
                    'guildId': guild.id,
                    'userId': member.id
                },
                {
                    '$set': {
                        'name': "{member}'s channel"
                    },
                },
                {
                    'upsert': true,
                    'new': true,
                    'setDefaultsOnInsert': true,
                },
            );
        }

        if (
            !setting ||
            !setting.isEnabled
        ) {
            return;
        };

        if (current?.channelId === setting.channelId) {
            const newChannel = await guild.channels.create({
                'name': custom.name.replace(/{member}/gi, member.user.username),
                'parent': current.channel?.parentId || null,
                'type': ChannelType.GuildVoice,
                'userLimit': custom.maxSlots
            });

            client.voiceChannelCache.set(newChannel.id, member);
            member.voice.setChannel(newChannel.id);
        }

        if (
            client.voiceChannelCache.get(old.channelId) &&
            !old.channel.members.size
        ) {
            old.channel.delete();
        }
    },
});
