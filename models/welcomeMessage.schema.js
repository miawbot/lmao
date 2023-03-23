const { client } = require('../structures/topokki')

module.exports = client.database.schema('welcomeMessage', {
    guildId: { type: String, required: true, unique: true },
    channelId: { type: String },
    isEnabled: { type: Boolean, required: true },
    color: { type: String },
    title: { type: String },
    description: { type: String },
    image: { type: String },
    footer: { type: String },
    timestamp: { type: Boolean, default: false },
});
