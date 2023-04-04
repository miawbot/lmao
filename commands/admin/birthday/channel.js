const { Topokki } = require('../../../structures/topokki');
const { CommandInteraction } = require('discord.js');
const { Subcommand } = require('../../../helpers/command');

module.exports = new Subcommand({
    'name': 'birthday.channel',

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    async callback(client, interaction) {
        const BirthdayChannel = client.database.get('birthday.channel');
        const setting = await BirthdayChannel.findOne({ 'guildId': interaction.guildId });

        const options = client.sanitize({
            'isEnabled': interaction.options.getBoolean('is_enabled'),
            'channelId': interaction.options.getChannel('text_channel'),
        });

        if (!Object.keys(options).length) {
            client.reply(interaction, 'No options were provided');
            return;
        }

        if (
            !setting &&
            (!setting?.channelId && !options.channelId)
        ) {
            client.reply(interaction, 'Unable to update setting since no text channel has been set');
            return;
        }

        await BirthdayChannel.findOneAndUpdate(
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