const { Topokki } = require('../../../../structures/topokki');
const { CommandInteraction } = require('discord.js');
const { Subcommand } = require('../../../../helpers/command');

module.exports = new Subcommand({
    'name': 'welcome.role.remove',

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    async callback(client, interaction) {
        const WelcomeRole = client.database.get('welcome.role');
        const role = interaction.options.getRole('role');

        await WelcomeRole.findOneAndDelete({
            'guildId': interaction.guildId,
            'roleId': role.id,
        })

        interaction.reply(`Removed role ${inlineCode(role.name)}`);
    }
});