const { Topokki } = require('../../../structures/topokki');
const { CommandInteraction, inlineCode } = require('discord.js');
const { Subcommand } = require('../../../helpers/command');

module.exports = new Subcommand({
    'name': 'leaderboard.remove',

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    async callback(client, interaction) {
        const Leaderboard = client.database.get('leaderboard');
        const member = interaction.options.getMember('member');

        await Leaderboard.findOneAndDelete({
            'guildId': interaction.guildId,
            'userId': member?.id,
        })

        interaction.reply('Done!');
    }
});