const { client } = require('../structures/bibimbap')

module.exports = client.database.schema('joinToCreate', {
    guildId: { type: String, required: true, unique: true },
    channelId: { type: String },
    isEnabled: { type: Boolean, default: false },
});
