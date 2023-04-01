const { Topokki } = require('../../structures/topokki');
const { Event } = require('../../helpers/event');
const { GuildMember, EmbedBuilder, userMention } = require('discord.js');

module.exports = new Event({
    'name': 'guildMemberAdd',

    /**
     * 
     * @param {Topokki} client
     * @param {GuildMember} member 
     */
    callback(client, member) {
        const BotPrevention = client.database.get('botprevention');
        const WelcomeEmbed = client.database.get('welcome.embed');
        const WelcomeRole = client.database.get('welcome.role');

        WelcomeRole.find({ 'guildId': member.guild.id }).then((roles) => {
            if (!roles) {
                return;
            }

            member.roles.add(roles.filter((v) => v?.roleId));
        });

        BotPrevention.findOne({ 'guildId': member.guild.id }).then((settings) => {
            if (
                !settings &&
                !settings.isEnabled
            ) {
                return;
            }

            const timeout = setTimeout(() => {
                const isActive = client.botPreventionCache.get(member.user.id);

                if (
                    isActive ||
                    member.user.bot
                ) {
                    clearTimeout(timeout);
                    return;
                }

                member.kick();
            }, settings.timeout);
        })

        WelcomeEmbed.findOne({ 'guildId': member.guild.id }).then((message) => {
            if (!message) {
                return;
            }

            const channel = member.guild.channels.cache.get(message?.channelId);
            const embed = new EmbedBuilder();

            if (
                !message.isEnabled ||
                !channel
            ) {
                return;
            }

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

            channel.send({ 'embeds': [embed] });
        })
    },
});
