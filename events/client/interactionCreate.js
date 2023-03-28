const { Topokki } = require('../../structures/topokki');
const { Event } = require('../../helpers/event');
const { CommandInteraction } = require('discord.js');

module.exports = new Event({
    'name': 'interactionCreate',

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    async callback(client, interaction) {
        if (!interaction.isCommand()) {
            return
        };

        const command = client.commands.get(interaction.commandName);
        const voiceChannel = interaction.member?.voice?.channel;

        if (!command) {
            return
        };

        if (
            command.getSetting('voiceChannel') &&
            !voiceChannel
        ) {
            client.reply(interaction, 'This command can only be used when you are inside of a voice channel');
            return;
        }

        if (
            command.getSetting('sharedVoiceChannel') &&
            client.voice.adapters.get(interaction.guildId) &&
            !voiceChannel?.members.has(client.user.id)
        ) {
            client.reply(interaction, 'This command can only be used in a voice channel that we both share');
            return;
        }

        if (
            command.getSetting('queueNotEmpty') &&
            !client.player.getQueue(interaction.guildId)
        ) {
            client.reply(interaction, 'There is no queue available to use this command');
            return;
        }

        try {
            await command.callback(client, interaction);
        } catch (err) {
            console.error(err);
        }
    }
});
