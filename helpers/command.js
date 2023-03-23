const { CommandInteraction } = require("discord.js");

class CommandSettingsType {
    /**
     * user must be in a voice channel
     */
    voiceChannel = false;

    /**
     * client and user must be the same voice channel for this command to work
     */
    sharedVoiceChannel = false;

    /**
     * queue must not be empty when command is issued
     */
    queueNotEmpty = false;
}

class CommandSettings extends CommandSettingsType {

    /**
     * 
     * @param {CommandSettingsType} data 
     */
    constructor(data) {
        super();

        this.enableSharedVoiceChannel = data.enableSharedVoiceChannel;
        this.enableVoiceChannel = data.enableVoiceChannel;
    }
}

class CommandType {
    name = '';
    description = '';
    options = [];
    isPlayer = false;
    ownerOnly = false;

    /**
     * @type {CommandSettings}
     */
    settings = {};

    /**
     * @type {Function}
     */
    callback = null;
}

class Command extends CommandType {
    /**
     * 
     * @param {CommandType} data 
     */
    constructor(data) {
        super();

        if (
            !data.name ||
            !data.description ||
            !data.callback
        ) {
            throw new Error('command module is missing properties');
        }

        data = Object.assign(new CommandType(), data);

        if (data.ownerOnly) {
            this.default_permission = false;
        };

        this.name = data.name;
        this.description = data.description;
        this.options = data.options;
        this.isPlayer = data.isPlayer;
        this.settings = data.settings;

        /**
         * 
         * @param {Topokki} client
         * @param {CommandInteraction} interaction
         */
        this.callback = data.callback;
    }

    /**
     * 
     * @param {string} setting 
     * @returns {CommandSettings[]}
     */
    getSetting(setting) {
        return this.settings[setting] || false;
    }
}

module.exports = { Command, CommandSettings, CommandType };