const { Bibimbap } = require('../../structures/bibimbap');
const { ApplicationCommandOptionType, CommandInteraction } = require('discord.js');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    name: 'jointocreate',
    description: 'set up a join-to-create voice channel',
    ownerOnly: true,
    options: [
        {
            type: ApplicationCommandOptionType.Channel,
            name: 'voice_channel',
            description: 'provide a voice channel to act as a join-to-create voice channel',
            channel_types: [2],
        },
        {
            type: ApplicationCommandOptionType.Boolean,
            name: 'enabled',
            description: 'enable/disable join-to-create',
        },
    ],

    /**
     * 
     * @param {Bibimbap} client 
     * @param {CommandInteraction} interaction 
     */
    callback(client, interaction) {
        const JoinToCreate = client.database.get('joinToCreate');

        const options = client.cleanObject({
            channelId: interaction.options.getChannel('voice_channel')?.id,
            isEnabled: interaction.options.getBoolean('enabled'),
        })

        if (!Object.keys(options).length) {
            client.notification(interaction, 'no options were provided');
            return;
        }

        const voiceChannel = interaction.guild.channels.cache.get(options.channelId);

        if (!voiceChannel) {
            client.notification(interaction, 'selected voice channel does not exist in this server');
            return;
        }

        JoinToCreate.findOne({ guildId: interaction.guildId }, function (err, doc) {
            if (err) return;

            if (doc === null) {
                client.notification(interaction, 'cannot update setting, no voice channel has been configured');
                return;
            }
        })

        JoinToCreate.findOneAndUpdate({ guildId: interaction.guildId }, { $set: options }, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        }, function (err, doc) { });

        interaction.reply(`join-to-create voice channel settings have been updated`);
    }
})