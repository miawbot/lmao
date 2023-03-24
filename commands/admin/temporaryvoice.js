const { Topokki } = require('../../structures/topokki');
const { ApplicationCommandOptionType, CommandInteraction } = require('discord.js');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    name: 'temporaryvoice',
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
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    async callback(client, interaction) {
        const options = client.getOptions(interaction, [
            'enabled',
            'voice_channel'
        ]);

        if (!Object.keys(options).length) {
            client.reply(interaction, 'no options were provided');
            return;
        }

        const $set = {
            isEnabled: options.enabled,
            channelId: options.voice_channel.id
        }

        const channel = interaction.guild.channels.cache.get($set.channelId);

        console.log(channel)

        if (!channel) {
            client.reply(interaction, 'selected voice channel does not exist in this server');
            return;
        }

        const TemporaryVoiceChannel = client.database.get('temporaryVoiceChannel');

        TemporaryVoiceChannel.findOne({ guildId: interaction.guildId }).then((channel) => {
            if (!channel) {
                client.reply(interaction, 'cannot update setting, no voice channel has been configured');
                return;
            }
        })

        TemporaryVoiceChannel.findOneAndUpdate({ guildId: interaction.guildId }, { $set }, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        })

        interaction.reply(`temporary voice channel settings have been updated`);
    }
})