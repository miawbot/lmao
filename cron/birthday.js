const { EmbedBuilder, userMention } = require("discord.js");
const { Cron } = require("../helpers/cron");
const { Topokki } = require("../structures/topokki");

module.exports = new Cron({
    'name': 'birthday',
    'schedule': '0 0 0 * * *',

    /**
     * 
     * @param {Topokki} client 
     * @param {Cron} cron 
     */
    async callback(client, cron) {
        const Birthday = client.database.get('birthday');
        const BirthdayChannel = client.database.get('birthday.channel')

        for (const setting of await Birthday.find({ 'date': Date.now() })) {
            const _channel = await BirthdayChannel.findOne({ 'guildId': setting.guildId });

            if (
                !_channel ||
                !_channel.isEnabled
            ) {
                return;
            }

            const guild = await client.guilds.fetch(setting.guildId);
            const member = await guild.members.fetch(setting.userId);
            const channel = await guild.channels.fetch(_channel.channelId);

            if (
                !guild &&
                !member &&
                !channel
            ) {
                return;
            }

            const embed = new EmbedBuilder()
                .setTitle('Birthday Announcement')
                .setDescription(`Wishing ${userMention(member.user.id)} a happy birthday!`)
                .setTimestamp();

            channel.send({ 'embeds': [embed] });
        }
    }
})