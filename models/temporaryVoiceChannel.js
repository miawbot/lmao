const { client } = require('../structures/topokki')

module.exports = client.database.schema('temporaryVoiceChannel', {
    'guildId': {
        'type': String,
        'required': true,
        'unique': true
    },
    'defaultName': {
        'type': String,
        'default': "{member}'s channel"
    },
    'channelId': { 'type': String },
    'isEnabled': {
        'type': Boolean,
        'default': false
    },
});
