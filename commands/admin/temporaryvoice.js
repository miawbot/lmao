const { Topokki } = require('../../structures/topokki');
const { ApplicationCommandOptionType, CommandInteraction } = require('discord.js');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    'name': 'temporaryvoice',
    'description': 'Set up temporary voice channels',
    'ownerOnly': true,
    'options': [
        {
            'type': ApplicationCommandOptionType.Channel,
            'name': 'voice_channel',
            'description': 'Provide a voice channel to act as a hook for temporary voice channels',
            'channel_types': [2],
        },
        {
            'type': ApplicationCommandOptionType.Boolean,
            'name': 'enabled',
            'description': 'Enable/disable temporary voice channels',
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
            client.reply(interaction, 'No options were provided');
            return;
        }

        const channel = await TemporaryVoiceChannel.findOne({ 'guildId': interaction.guildId });

        if (!channel && !options.channelId) {
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

        interaction.reply(`The settings have been updated`);
    }
})