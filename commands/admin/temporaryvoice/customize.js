const { Topokki } = require('../../../structures/topokki');
const { CommandInteraction, PermissionsBitField } = require('discord.js');
const { Subcommand } = require('../../../helpers/command');

module.exports = new Subcommand({
    'name': 'temporaryvoice.customize',

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    async callback(client, interaction) {
        const CustomVoiceChannel = client.database.get('customvoicechannel');

        const options = client.sanitize({
            'name': interaction.options.getString('name'),
            'maxSlots': interaction.options.getNumber('max_slots'),
        });

        if (!Object.keys(options).length) {
            client.reply(interaction, 'No options were provided');
            return;
        }

        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.member.user.id);
        const channel = member.voice.channel;

        if (
            channel &&
            options.maxSlots &&
            client.voiceChannelCache.get(channel.id)?.id === member.id
        ) {
            channel.setUserLimit(options.maxSlots)
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