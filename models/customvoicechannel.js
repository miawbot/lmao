const { client } = require('../structures/topokki')

module.exports = client.database.schema('customvoicechannel', {
    'guildId': {
        'type': String,
        'required': true,
    },
    'userId': { 'type': String },
    'name': { 'type': String },
    'maxSlots': {
        'type': Number,
        'default': 0
    },
});
