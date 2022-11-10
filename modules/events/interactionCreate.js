const { Event } = require('../../structures/event');
const { DistubeType, DistubeEventType } = require('../../structures/distube');

module.exports = new Event({
    name: 'interactionCreate',
    module_type: new DistubeEventType(),

    run(client, interaction) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            const module_type = command.module_type;

            if (module_type instanceof DistubeType) {
                const voiceChannel = interaction.member.voice.channel;

                if (module_type.require_in_voice_channel) {
                    if (!voiceChannel) {
                        client.error(interaction, 'this command cannot be used outside of a voice channel');

                        return;
                    }
                }

                if (
                    !voiceChannel.members.has(client.user.id) &&
                    command.require_shared_voice_channel
                ) {
                    client.error(interaction, 'this command cannot be used outside of client\'s voice channel');

                    return;
                }
            }

            command.run(client, interaction);
        }
    },
});
