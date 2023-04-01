const { Topokki } = require('../../../../structures/topokki');
const { CommandInteraction, inlineCode, EmbedBuilder } = require('discord.js');
const { Subcommand } = require('../../../../helpers/command');

module.exports = new Subcommand({
    'name': 'welcome.role.show',

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    async callback(client, interaction) {
        const WelcomeRole = client.database.get('welcome.role');
        const _roles = await WelcomeRole.find({ 'guildId': interaction.guildId }) || [];

        const roles = [];
        for (const role of _roles) {
            if (interaction.member.guild.roles.cache.get(role.roleId)) {
                roles.push(roleMention(role.roleId));
            };
        }

        let description = roles.length
            ? `Here are the current welcome roles for newcomers: ${roles.join(', ')}`
            : `No roles found. Use ${inlineCode('/welcome roles add')} to add new welcome roles`;

        const embed = new EmbedBuilder()
            .setTitle('List of Welcome Roles')
            .setColor('#1E1F22')
            .setDescription(description);

        interaction.reply({ 'embeds': [embed] });
    }
});