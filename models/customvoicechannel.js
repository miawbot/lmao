const { client } = require('../structures/topokki')

module.exports = client.database.schema('customvoicechannel', {
    'guildId': {
        'type': String,
        'required': true,
    },
    'name': { 'type': String },
    'userId': { 'type': String },
});
