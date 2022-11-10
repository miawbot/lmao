const { Command } = require('../../../structures/command');
const { DistubeType } = require('../../../structures/distube');

module.exports = new Command({
	name: 'skip',
	description: 'skip current song',
	module_type: new DistubeType(),

	run(client, interaction) {
		const queue = client.distube.getQueue(interaction.guildId);

		if (!queue) {
			client.error(interaction, 'no queue available to use this command');

			return;
		}

		client.distube.skipSong(queue);

		interaction.reply('song has been skipped');
	},
});
