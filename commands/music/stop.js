const { Command } = require('../../structures/command');

module.exports = new Command({
	name: 'stop',
	description: 'stop queue and leave voice channel',
	module_type: 'distube',

	async run(client, interaction) {
		const queue = client.distube.getQueue(interaction.guildId);

		if (!queue) {
			client.error(interaction, 'no queue available to use this command');

			return;
		}

		await queue.stop();

		interaction.reply('song has been skipped');
	},
});
