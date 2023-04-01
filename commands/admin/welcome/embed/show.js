const { Topokki } = require('../../../../structures/topokki');
const { CommandInteraction, EmbedBuilder, userMention } = require('discord.js');
const { Subcommand } = require('../../../../helpers/command');

module.exports = new Subcommand({
    'name': 'welcome.embed.show',

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    async callback(client, interaction) {
        const WelcomeEmbed = client.database.get('welcome.embed');
        const member = interaction.member;

        WelcomeEmbed.findOne({ 'guildId': member.guild.id }).then((message) => {
            if (!message) {
                client.reply(interaction, 'Unable to view embed since there is no embed set');
                return;
            }

            const embed = new EmbedBuilder();

            if (message.title) {
                const _title = message.title
                    .replace(/{member}/gi, member.user.tag)
                    .replace(/{guild}/gi, member.guild.name)

                embed.setTitle(_title);
            }

            if (message.description) {
                const _desc = message.description
                    .replace(/{member}/gi, userMention(member.user.id))
                    .replace(/{guild}/gi, member.guild.name)
                    .replace(/\\n/g, '\n');

                embed.setDescription(_desc);
            }

            if (message.color) {
                embed.setColor(message.color);
            }

            if (message.image) {
                embed.setImage(message.image);
            }

            if (message.footer) {
                embed.setFooter({ text: message.footer });
            }

            if (message.timestamp) {
                embed.setTimestamp();
            }

            interaction.reply({ 'embeds': [embed] });
        })
    }
});