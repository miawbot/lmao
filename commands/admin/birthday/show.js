const { Topokki } = require('../../../structures/topokki');
const { CommandInteraction, inlineCode } = require('discord.js');
const { Subcommand } = require('../../../helpers/command');

module.exports = new Subcommand({
    'name': 'birthday.show',

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    async callback(client, interaction) {
        const Birthday = client.database.get('birthday');

        const setting = await Birthday.findOne({
            'guildId': interaction.guildId,
            'userId': interaction.options.getMember('member')?.id
        })

        const user = client.users.cache.get(setting?.userId);

        if (!setting || !user) {
            client.reply(interaction, 'Provided member cannot be found in the server or member has not set their birthday');
            return;
        }

        let date = setting.date;
        date = date.toLocaleString('default', { month: 'long' }) + ' ' + date.getDate()

        interaction.reply(`${user.username}'s birthday is on ${inlineCode(date)}`);
    }
});