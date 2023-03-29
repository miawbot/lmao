const { CommandInteraction } = require("discord.js");

class CommandSettingsType {
    /**
     * User must be in a voice channel
     */
    voiceChannel = false;

    /**
     * Client and user must be the same voice channel for this command to work
     */
    sharedVoiceChannel = false;

    /**
     * Queue must not be empty when command is issued
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
    dmPermission = false;

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
            throw new Error('Command module is missing properties');
        }

        data = Object.assign(new CommandType(), data);

        if (data?.defaultMemberPermissions) {
            this.defaultMemberPermissions = data.defaultMemberPermissions;
        }

        this.dmPermission = data.dmPermission;
        this.name = data.name;
        this.description = data.description;
        this.options = data.options;
        this.isPlayer = data.isPlayer;
        this.settings = data.settings;

        /**
         * 
         * @type {Function}
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

class SubcommandType {
    name = '';

    /**
     * @type {Function}
     */
    callback = null;
}


class Subcommand extends SubcommandType {

    /**
    * 
    * @param {SubcommandType} data 
    */
    constructor(data) {
        super();

        if (
            !data.name ||
            !data.callback
        ) {
            throw new Error('Subcommand module is missing properties');
        }

        this.name = data.name;

        /**
         * 
         * @type {Function}
         * @param {Topokki} client
         * @param {CommandInteraction} interaction
         */
        this.callback = data.callback;
    }
}

module.exports = { Command, CommandSettings, CommandType, Subcommand };