const { client } = require('../../structures/topokki')

module.exports = client.database.schema('welcome.role', {
    'guildId': {
        'type': String,
        'required': true
    },
    'roleId': { 'type': String },
});
