const { Topokki } = require('../../../structures/topokki');
const { CommandInteraction } = require('discord.js');
const { Subcommand } = require('../../../helpers/command');

module.exports = new Subcommand({
    'name': 'birthday.manage',

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    async callback(client, interaction) {
        const Birthday = client.database.get('birthday');
        const setting = Birthday.findOne({ 'guildId': interaction.guildId, 'userId': interaction.user.id })

        const options = client.sanitize({
            'isEnabled': interaction.options.getBoolean('is_enabled'),
            'date': interaction.options.getString('date'),
        });

        if (!Object.keys(options).length) {
            client.reply(interaction, 'No options were provided');
            return;
        }

        if (
            !setting &&
            (!setting?.date && !options.date)
        ) {
            client.reply(interaction, 'Unable to update setting since no date has been set');
            return;
        }

        if (options?.date) {
            const date = new Date(options.date);

            if (
                !(date instanceof Date) &&
                isNaN(date.valueOf())
            ) {
                client.reply(interaction, 'Provided date is invalid, please try again')
                return;
            }

            options.date = date.toLocaleString('default', { month: 'long' }) + ' ' + date.getDate();
        }

        await BotPrevention.findOneAndUpdate(
            {
                'guildId': interaction.guildId,
                'userId': interaction.user.id
            },
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