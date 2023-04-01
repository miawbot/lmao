const { Topokki } = require('../../../../structures/topokki');
const { CommandInteraction } = require('discord.js');
const { Subcommand } = require('../../../../helpers/command');

module.exports = new Subcommand({
    'name': 'welcome.embed.manage',

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    async callback(client, interaction) {
        const WelcomeEmbed = client.database.get('welcome.embed');

        const options = client.sanitize({
            'title': interaction.options.getString('title'),
            'description': interaction.options.getString('description'),
            'color': interaction.options.getString('color'),
            'image': interaction.options.getString('image'),
            'footer': interaction.options.getString('footer'),
            'timestamp': interaction.options.getBoolean('timestamp'),
        });

        if (!Object.keys(options).length) {
            client.reply(interaction, 'No options were provided');
            return;
        }

        const embed = await WelcomeEmbed.findOne({ 'guildId': interaction.guildId });

        if (embed) {
            await WelcomeEmbed.findOneAndUpdate(
                { 'guildId': interaction.guildId },
                { '$set': options }
            );

            interaction.reply('Updated welcome message embed settings!')
            return;
        }

        if (
            !options.description ||
            !options.title
        ) {
            client.reply(interaction, 'I cannot change the embed when there is no title nor description set');
            return;
        }

        if (
            options.color &&
            !options.color.match(/^#[a-f0-9]{6}$/i)
        ) {
            client.reply(interaction, 'The color option must be of a proper color hex format');
            return;
        }

        await WelcomeEmbed.create({
            'guildId': interaction.guildId,
            'isEnabled': true,
            ...options,
        });

        interaction.reply('Saved changes!');
    }
});