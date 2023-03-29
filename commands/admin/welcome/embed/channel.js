const { Topokki } = require('../../../../structures/topokki');
const { CommandInteraction } = require('discord.js');
const { Subcommand } = require('../../../../helpers/command');

module.exports = new Subcommand({
    'name': 'welcome.embed.channel',

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    async callback(client, interaction) {
        const WelcomeMessage = client.database.get('welcomeMessage');

        const options = client.sanitize({
            'channelId': interaction.options.getChannel('text_channel')?.id,
            'isEnabled': interaction.options.getBoolean('enabled')
        });

        if (!Object.keys(options).length) {
            client.reply(interaction, 'No options were provided');
            return;
        }

        const embed = await WelcomeMessage.findOne({ 'guildId': interaction.guildId });

        if (!embed) {
            client.reply(interaction, 'Welcome messages might be disabled or no welcome embed has been set');
            return;
        }

        await WelcomeMessage.findOneAndUpdate(
            { 'guildId': interaction.guildId },
            { '$set': options }
        );

        interaction.reply('Update welcome message channel settings!');
    }
});