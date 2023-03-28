const { client } = require('../structures/topokki')

module.exports = client.database.schema('welcomeRole', {
    'guildId': {
        'type': String,
        'required': true
    },
    'roleId': { 'type': String },
});
