const { Event } = require(__root + '/structures/event');
const { DistubeEventType } = require('../../../structures/distube');

module.exports = new Event({
	name: 'error',
	module_type: new DistubeEventType(),

	run(client, channel, err) {
		console.log(err);
	},
})
