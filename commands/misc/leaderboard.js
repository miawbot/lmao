const { Topokki } = require('../../structures/topokki');
const { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, userMention } = require('discord.js');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    'name': 'leaderboard',
    'description': 'Show a list of the most active members of this server',

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    async callback(client, interaction) {
        const Leaderboard = client.database.get('leaderboard');

        const members = await Leaderboard
            .find({ 'guildId': interaction.guildId })
            .sort({ 'points': -1 })
            .limit(10) || [];

        const entries = [];

        for (const [id, member] of members.entries()) {
            const user = await client.users
                .fetch(member.userId)
                .catch(() => null);

            if (user) {
                entries.push(`**${id + 1}** - ${userMention(user.id)}`);
            }
        }

        const embed = new EmbedBuilder()
            .setTitle('Leaderboard')
            .setDescription('Here is a list of the most active members of this server')
            .setTimestamp()
            .setColor('#ffc9b9')
            .setFields({
                'name': 'Members',
                'value': entries.join('\n\n'),
                'inline': true,
            });

        interaction.reply({ 'embeds': [embed] })
    }
})
