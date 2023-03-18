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
        const WelcomeRole = client.database.get('welcomeRole');

        WelcomeRole
            .find({ guildId: member.guild.id })
            .then((roles) => {
                if (roles) {
                    member.roles.add(roles.map(({ roleId }) => roleId))
                }
            });

        WelcomeMessage
            .findOne({ guildId: member.guild.id })
            .then((message) => {
                if (message) {
                    const textChannel = member.guild.channels.cache.get(message?.channelId);
                    const welcomeMessageEmbed = new EmbedBuilder();

                    if (
                        !message.isEnabled ||
                        !textChannel
                    ) {
                        return;
                    }

                    if (message.color) {
                        welcomeMessageEmbed.setColor(message.color);
                    }

                    if (message.image) {
                        welcomeMessageEmbed.setImage(message.image);
                    }

                    if (message.footer) {
                        welcomeMessageEmbed.setFooter({ text: message.footer });
                    }

                    if (message.timestamp) {
                        welcomeMessageEmbed.setTimestamp();
                    }

                    if (message.title) {
                        const title = message.title.replace(/{member}/gi, member.user.tag).replace(/{guild}/gi, member.guild.name);
                        welcomeMessageEmbed.setTitle(title);
                    }

                    if (message.description) {
                        const description = message.description.replace(/{member}/gi, `<@${member.user.id}>`).replace(/{guild}/gi, member.guild.name);
                        welcomeMessageEmbed.setDescription(description);
                    }

                    textChannel.send({ embeds: [welcomeMessageEmbed] });
                }
            })
    },
});
