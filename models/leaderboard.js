const { client } = require('../structures/topokki')

module.exports = client.database.schema('leaderboard', {
    'guildId': {
        'type': String,
        'required': true,
    },
    'userId': { 'type': String },
    'points': {
        'type': Number,
        'default': 0
    },
    'lastActive': { 'type': String },
});
