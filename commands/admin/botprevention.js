const { Topokki } = require('../../structures/topokki');
const { ApplicationCommandOptionType, CommandInteraction, ChannelType, PermissionFlagsBits } = require('discord.js');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    'name': 'botprevention',
    'description': 'Set up prevention for bot accounts (not actual bots)',
    'defaultMemberPermissions': [PermissionFlagsBits.Administrator],
    'options': [
        {
            'type': ApplicationCommandOptionType.Number,
            'name': 'timeout',
            'description': 'Provide a timeout in minutes',
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
        const BotPrevention = client.database.get('botprevention');
        const setting = await BotPrevention.findOne({ 'guildId': interaction.guildId });

        const options = client.sanitize({
            'isEnabled': interaction.options.getBoolean('is_enabled'),
            'timeout': interaction.options.getNumber('timeout'),
        });

        if (options?.timeout) {
            options.timeout *= 1000 * 60;
        }

        if (!Object.keys(options).length) {
            client.reply(interaction, 'No options were provided');
            return;
        }

        if (
            !setting &&
            (!setting?.timeout && !options.timeout)
        ) {
            client.reply(interaction, 'Unable to update setting since no timeout has been set');
            return;
        }

        await BotPrevention.findOneAndUpdate(
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