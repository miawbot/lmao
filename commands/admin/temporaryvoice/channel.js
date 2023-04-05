const { Topokki } = require('../../../structures/topokki');
const { CommandInteraction, PermissionsBitField } = require('discord.js');
const { Subcommand } = require('../../../helpers/command');

module.exports = new Subcommand({
    'name': 'temporaryvoice.channel',
    'defaultMemberPermissions': [PermissionsBitField.Flags.Administrator],

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    async callback(client, interaction) {
        const TemporaryVoiceChannel = client.database.get('temporary.voicechannel');
        const setting = await TemporaryVoiceChannel.findOne({ 'guildId': interaction.guildId });

        const options = client.sanitize({
            'isEnabled': interaction.options.getBoolean('is_enabled'),
            'channelId': interaction.options.getChannel('voice_channel'),
        });

        if (!Object.keys(options).length) {
            client.reply(interaction, 'No options were provided');
            return;
        }

        if (
            !setting &&
            (!setting?.channelId && !options.channelId)
        ) {
            client.reply(interaction, 'Unable to update setting since no voice channel has been set');
            return;
        }

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
});