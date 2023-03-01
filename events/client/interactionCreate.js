const Bibimbap = require('../../structs/Bibimbap');
const { Event } = require('../../structs/event');
const { CommandInteraction } = require('discord.js');

module.exports = new Event({
    name: 'interactionCreate',

    /**
     * 
     * @param {Bibimbap} client 
     * @param {CommandInteraction} interaction 
     */
    callback(client, interaction) {
        if (!interaction.isCommand()) {
            return;
        }

        const command = client.getCommand(interaction.commandName);
        const voiceChannel = interaction.member?.voice?.channel;

        if (
            command.getSetting('voiceChannel') &&
            !voiceChannel
        ) {
            client.userOnly(interaction, 'this command cannot be used outside of a voice channel');
            return;
        }

        if (
            command.getSetting('sharedVoiceChannel') &&
            client.voice.adapters.get(interaction.guildId) &&
            !voiceChannel.members.has(client.user.id)
        ) {
            client.userOnly(interaction, 'this command can only be used in a voice channel where i am in');
            return;
        }

        if (
            command.getSetting('queueNotEmpty') &&
            !client.player.getQueue(interaction.guildId)
        ) {
            client.userOnly(interaction, 'no queue available to use this command');
            return;
        }

        command.callback(client, interaction);
    }
});
