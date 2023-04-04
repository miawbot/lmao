const { EmbedBuilder, inlineCode, userMention } = require("discord.js");
const { Cron, CronScheduleType } = require("../helpers/cron");
const { Topokki } = require("../structures/topokki");

module.exports = new Cron({
    'name': 'birthday',

    /**
     * 
     * @param {Topokki} client 
     * @param {CronScheduleType} schedule 
     * @param {Cron} cron 
     */
    async callback(client, schedule, cron) {
        const Birthday = client.database.get('birthday');
        const BirthdayChannel = client.database.get('birthday.channel');

        for (const setting of await Birthday.find()) {
            cron.scheduleStart(client, schedule, async () => {
                if (Date.now !== Birthday.date) {
                    return;
                }

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

                schedule.dateOfMonth = setting.date.getDate();
                schedule.month = setting.date.toLocaleString('default', { 'month': 'long' });

                const embed = new EmbedBuilder()
                    .setTitle('Birthday Announcement')
                    .setDescription(`Wishing ${userMention(member.user.id)} a happy birthday!`)
                    .setTimestamp();

                channel.send({ 'embeds': [embed] });
            })
        }
    }
})