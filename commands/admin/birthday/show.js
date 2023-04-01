const { Topokki } = require('../../../structures/topokki');
const { CommandInteraction, EmbedBuilder, inlineCode } = require('discord.js');
const { Subcommand } = require('../../../helpers/command');

module.exports = new Subcommand({
    'name': 'birthday.show',

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    async callback(client, interaction) {
        const Birthday = client.database.get('birthday');

        const setting = Birthday.findOne({
            'guildId': interaction.guildId,
            'userId': interaction.options.getUser('user')?.id
        })

        const user = client.users.cache.get(setting.userId);

        if (!setting || !user) {
            client.reply(interaction, 'Provided member cannot be found in the server or member has not set their birthday');
            return;
        }

        const embed = new EmbedBuilder()
            .setDescription(`${user.username}'s birthday is on ${inlineCode(setting.date)}`);

        interaction.reply({ 'embeds': [embed] });
    }
});