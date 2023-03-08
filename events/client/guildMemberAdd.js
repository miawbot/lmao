const { Bibimbap } = require('../../structures/bibimbap');
const { Event } = require('../../helpers/event');
const { GuildMember, EmbedBuilder } = require('discord.js');

module.exports = new Event({
    name: 'guildMemberAdd',

    /**
     * 
     * @param {Bibimbap} client
     * @param {GuildMember} member 
     */
    callback(client, member) {
        const WelcomeMessage = client.database.get('welcomeMessage');

        WelcomeMessage.findOne({ guildId: member.guild.id }, function (err, doc) {
            if (err) return;

            if (doc) {
                const textChannel = member.guild.channels.cache.get(doc?.channelId);
                const welcomeMessageEmbed = new EmbedBuilder();

                if (
                    !doc.isEnabled ||
                    !textChannel
                ) {
                    return;
                }

                if (
                    doc.color &&
                    doc.color !== 'none'
                ) {
                    welcomeMessageEmbed.setColor(doc.color);
                }

                if (doc.image) {
                    welcomeMessageEmbed.setImage(doc.image);
                }

                if (doc.footer) {
                    welcomeMessageEmbed.setFooter({ text: doc.footer });
                }

                if (doc.timestamp) {
                    welcomeMessageEmbed.setTimestamp();
                }

                if (doc.title) {
                    const title = doc.title.replace(/{member}/gi, member.user.tag).replace(/{guild}/gi, member.guild.name);
                    welcomeMessageEmbed.setTitle(title);
                }

                if (doc.description) {
                    const description = doc.description.replace(/{member}/gi, `<@${member.user.id}>`).replace(/{guild}/gi, member.guild.name);
                    welcomeMessageEmbed.setDescription(description);
                }

                textChannel.send({ embeds: [welcomeMessageEmbed] });
            }
        })
    },
});
