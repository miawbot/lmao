const { Bibimbap } = require('../../structures/bibimbap');
const { Event } = require('../../helpers/event');
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
            client.notification(interaction, 'this command cannot be used outside of a voice channel');
            return;
        }

        if (
            command.getSetting('sharedVoiceChannel') &&
            client.voice.adapters.get(interaction.guildId) &&
            !voiceChannel.members.has(client.user.id)
        ) {
            client.notification(interaction, 'this command can only be used in a voice channel where i am in');
            return;
        }

        if (
            command.getSetting('queueNotEmpty') &&
            !client.player.getQueue(interaction.guildId)
        ) {
            client.notification(interaction, 'no queue available to use this command');
            return;
        }

        try {
            command.callback(client, interaction);
        } catch (err) {
            console.log(`something went wrong: ${err}`)
        }
    }
});
