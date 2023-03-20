const { Bibimbap } = require('../../structures/bibimbap');
const { ApplicationCommandOptionType, CommandInteraction } = require('discord.js');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    name: 'temporary_voice',
    description: 'set up temporary voice channels',
    ownerOnly: true,
    options: [
        {
            type: ApplicationCommandOptionType.Channel,
            name: 'voice_channel',
            description: 'provide a voice channel to act as a hook for temporary voice channels',
            channel_types: [2],
        },
        {
            type: ApplicationCommandOptionType.Boolean,
            name: 'enabled',
            description: 'enable/disable temporary voice channels',
        },
    ],

    /**
     * 
     * @param {Bibimbap} client 
     * @param {CommandInteraction} interaction 
     */
    async callback(client, interaction) {
        const TemporaryVoiceChannel = client.database.get('temporaryVoiceChannel');

        const options = client.sanitizeObject({
            channelId: interaction.options.getChannel('voice_channel')?.id,
            isEnabled: interaction.options.getBoolean('enabled'),
        })

        if (!Object.keys(options).length) {
            client.notification(interaction, 'no options were provided');
            return;
        }

        const vc = interaction.guild.channels.cache.get(options.channelId);

        if (!vc) {
            client.notification(interaction, 'selected voice channel does not exist in this server');
            return;
        }

        TemporaryVoiceChannel
            .findOne({ guildId: interaction.guildId })
            .then((tvc) => {
                if (tvc === null) {
                    client.notification(interaction, 'cannot update setting, no voice channel has been configured');
                    return;
                }
            })

        await TemporaryVoiceChannel.findOneAndUpdate(
            { guildId: interaction.guildId },
            { $set: options },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
            }
        )

        interaction.reply(`temporary voice channel settings have been updated`);
    }
})