const { Topokki } = require('../../../../structures/topokki');
const { CommandInteraction, inlineCode } = require('discord.js');
const { Subcommand } = require('../../../../helpers/command');

module.exports = new Subcommand({
    'name': 'welcome.role.add',

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    async callback(client, interaction) {
        const WelcomeRole = client.database.get('welcome.role');
        const role = interaction.options.getRole('role');

        const _role = await WelcomeRole.findOne({
            'guildId': interaction.guildId,
            'roleId': role.id
        });

        if (_role) {
            client.reply(interaction, `Role ${inlineCode(role.name)} is already set as a welcome role`);
            return;
        }

        await WelcomeRole.create({
            'guildId': interaction.guildId,
            'roleId': role.id
        })

        interaction.reply(`Added role ${inlineCode(role.name)}`);
    }
});