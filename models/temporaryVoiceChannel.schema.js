const { client } = require('../structures/bibimbap')

module.exports = client.database.schema('temporaryVoiceChannel', {
    guildId: { type: String, required: true, unique: true },
    channelId: { type: String },
    isEnabled: { type: Boolean, default: false },
});
