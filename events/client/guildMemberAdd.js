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
                    member.roles.add(
                        roles.map(({ roleId }) => roleId)
                    )
                }
            });

        WelcomeMessage
            .findOne({ guildId: member.guild.id })
            .then((message) => {
                if (message) {
                    const channel = member.guild.channels.cache.get(message?.channelId);
                    const embed = new EmbedBuilder();

                    if (
                        !message.isEnabled ||
                        !channel
                    ) {
                        return;
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

                    if (message.title) {
                        embed.setTitle(message.title
                            .replace(/{member}/gi, member.user.tag)
                            .replace(/{guild}/gi, member.guild.name)
                        );
                    }

                    if (message.description) {
                        embed.setDescription(message.description
                            .replace(/{member}/gi, `<@${member.user.id}>`)
                            .replace(/{guild}/gi, member.guild.name)
                        );
                    }

                    channel.send({ embeds: [embed] });
                }
            })
    },
});
