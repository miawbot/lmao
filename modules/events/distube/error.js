const { Event } = require('../../../structures/event');

module.exports = new Event({
	name: 'error',
	module_type: 'distube',

	run(client, channel, err) {
		console.log(err);
	},
})
