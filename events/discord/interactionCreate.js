const { Event } = require('../../structures/event');

module.exports = new Event({
    name: 'interactionCreate',

    run(client, interaction) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (command.module_type === 'distube') {
                const voiceChannel = interaction.member.voice.channel;

                if (
                    command.restraints.require_in_voice_channel &&
                    !voiceChannel || !voiceChannel
                ) {
                    client.error(interaction, 'this command cannot be used outside of a voice channel');

                    return;
                }

                if (
                    command.restraints.require_shared_voice_channel &&
                    !voiceChannel.members.has(client.user.id)
                ) {
                    client.error(interaction, 'this command can only be used in a shared voice channel');

                    return;
                }
            }

            command.run(client, interaction);
        }
    },
});
