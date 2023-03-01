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
        const voiceChannel = client.getCurrentVoiceChannel(interaction);

        if (
            command.getSetting('voiceChannel') &&
            !voiceChannel
        ) {
            client.error(interaction, 'this command cannot be used outside of a voice channel');
            return;
        }

        if (
            command.getSetting('sharedVoiceChannel') &&
            !voiceChannel.members.has(client.user.id) &&
            client.voice.adapters.size > 0
        ) {

            console.log(client.voice.adapters.size)
            client.error(interaction, 'this command can only be used in a voice channel shared with the bot');
            return;
        }

        if (
            command.getSetting('queueNotEmpty') &&
            !client.player.getQueue(interaction.guildId)
        ) {
            client.error(interaction, 'no queue available to use this command');

            return;
        }

        try {
            command.callback(client, interaction);
        } catch (err) {
            console.log('something went wrong: ' + err)
        }
    }
});
