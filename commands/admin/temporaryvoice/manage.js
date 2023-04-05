const { Topokki } = require('../../../structures/topokki');
const { CommandInteraction, PermissionsBitField } = require('discord.js');
const { Subcommand } = require('../../../helpers/command');

module.exports = new Subcommand({
    'name': 'temporaryvoice.manage',

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    async callback(client, interaction) {
        const CustomVoiceChannel = client.database.get('customvoicechannel');

        const setting = await CustomVoiceChannel.findOne({
            'guildId': interaction.guildId,
            'userId': interaction.user.id
        })

        const options = client.sanitize({
            'name': interaction.options.getString('name'),
        });

        if (!Object.keys(options).length) {
            client.reply(interaction, 'No options were provided');
            return;
        }

        if (
            !setting &&
            (!setting?.name && !options.name)
        ) {
            client.reply(interaction, 'Unable to update setting since no name has been set');
            return;
        }

        await CustomVoiceChannel.findOneAndUpdate(
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