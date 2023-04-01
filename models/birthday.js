const { client } = require('../structures/topokki')

module.exports = client.database.schema('birthday', {
    'guildId': {
        'type': String,
        'required': true,
    },
    'userId': {
        'type': String,
        'required': true,
    },
    'date': { 'type': Date },
    'isEnabled': {
        'type': Boolean,
        'default': false
    },
});
