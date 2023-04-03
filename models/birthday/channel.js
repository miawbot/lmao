const { client } = require('../../structures/topokki')

module.exports = client.database.schema('birthday.channel', {
    'guildId': {
        'type': String,
        'required': true,
        'unique': true
    },
    'channelId': { 'type': String },
    'isEnabled': {
        'type': Boolean,
        'default': false
    },
});
