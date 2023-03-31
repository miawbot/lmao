const { Topokki } = require('../../structures/topokki');
const { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, userMention, bold } = require('discord.js');
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

        const texts = [];
        const points = [];

        for (const [id, member] of members.entries()) {
            const user = await client.users
                .fetch(member.userId)
                .catch(() => null);

            if (
                user &&
                !user.bot &&
                member.points > 0
            ) {
                texts.push(bold(id + 1) + ' - ' + user.tag);
                points.push(member.points);
            }
        }

        const embed = new EmbedBuilder()
            .setTitle('Leaderboard')
            .setDescription('The list of the most active members of this server')
            .setTimestamp()
            .setColor('#1E1F22')
            .setFields(
                {
                    'name': 'Members',
                    'value': texts.join('\n\n'),
                    'inline': true,
                },
                {
                    'name': 'Points',
                    'value': points.join('\n\n'),
                    'inline': true,
                }
            );

        interaction.reply({ 'embeds': [embed] })
    }
})
