const { Event } = require('../../structures/event');
const { ClientEventType } = require('../../structures/client');

module.exports = new Event({
	name: 'ready',
	module_type: new ClientEventType(),

	run(client) {
		client.registerSlashCommands().then(() => {
			console.log('slash commands loaded')
		})
	},
})
