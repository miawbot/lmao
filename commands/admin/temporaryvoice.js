const { Topokki } = require('../../structures/topokki');
const { ApplicationCommandOptionType, CommandInteraction, ChannelType, PermissionFlagsBits } = require('discord.js');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    'name': 'temporaryvoice',
    'description': 'Set up temporary voice channels',
    'defaultMemberPermissions': [PermissionFlagsBits.Administrator],
    'options': [
        {
            'type': ApplicationCommandOptionType.Channel,
            'name': 'voice_channel',
            'description': 'Provide a voice channel to act as a hook for temporary voice channels',
            'channel_types': [ChannelType.GuildVoice],
        },
        {
            'type': ApplicationCommandOptionType.String,
            'name': 'default_name',
            'description': 'Change the default channel name',
        },
        {
            'type': ApplicationCommandOptionType.Boolean,
            'name': 'is_enabled',
            'description': 'Enable/disable',
        },
    ],

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    async callback(client, interaction) {
        const TemporaryVoiceChannel = client.database.get('temporary.voicechannel');

        const options = client.sanitize({
            'isEnabled': interaction.options.getBoolean('is_enabled'),
            'channelId': interaction.options.getChannel('voice_channel')?.id,
            'defaultName': interaction.options.getString('default_name'),
        });

        if (!Object.keys(options).length) {
            client.reply(interaction, 'No options were provided');
            return;
        }

        const channel = await TemporaryVoiceChannel.findOne({ 'guildId': interaction.guildId });

        if (
            !channel &&
            (!channel?.channelId && !options.channelId)
        ) {
            client.reply(interaction, 'Unable to update setting since no voice channel has been configured');
            return;
        };

        await TemporaryVoiceChannel.findOneAndUpdate(
            { 'guildId': interaction.guildId },
            { '$set': options },
            {
                'upsert': true,
                'new': true,
                'setDefaultsOnInsert': true,
            },
        );

        interaction.reply('The settings have been updated');
    }
})