const { Topokki } = require('../../structures/topokki');
const { ApplicationCommandOptionType, CommandInteraction } = require('discord.js');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    'name': 'temporaryvoice',
    'description': 'set up temporary voice channels',
    'ownerOnly': true,
    'options': [
        {
            'type': ApplicationCommandOptionType.Channel,
            'name': 'voice_channel',
            'description': 'provide a voice channel to act as a hook for temporary voice channels',
            'channel_types': [2],
        },
        {
            'type': ApplicationCommandOptionType.Boolean,
            'name': 'enabled',
            'description': 'enable/disable temporary voice channels',
        },
    ],

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    async callback(client, interaction) {
        const TemporaryVoiceChannel = client.database.get('temporaryVoiceChannel');

        const options = client.sanitize({
            'isEnabled': interaction.options.getBoolean('enabled'),
            'channelId': interaction.options.getChannel('voice_channel')?.id
        });

        if (!Object.keys(options).length) {
            client.reply(interaction, 'no options were provided');
            return;
        }

        const channel = await TemporaryVoiceChannel.findOne({ 'guildId': interaction.guildId });

        if (!channel && !options.channelId) {
            client.reply(interaction, 'cannot update setting, no voice channel has been configured');
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

        interaction.reply(`temporary voice channel settings have been updated`);
    }
})