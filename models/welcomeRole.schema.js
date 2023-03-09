const { client } = require('../structures/bibimbap')

module.exports = client.database.schema('welcomeRole', {
    guildId: { type: String, required: true },
    roleId: { type: String },
});
