const { client } = require('../structures/topokki')

module.exports = client.database.schema('botprevention', {
    'guildId': {
        'type': String,
        'required': true,
    },
    'timeout': {
        'type': Number,
        'default': 300000
    },
    'isEnabled': {
        'type': Boolean,
        'default': false
    },
});
