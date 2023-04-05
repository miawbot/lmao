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
    isCommandCategory = false;
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
            (!data.callback && !data.isCommandCategory)
        ) {
            throw new Error('Command module is missing properties');
        }

        data = Object.assign(new CommandType(), data);

        if (data?.defaultMemberPermissions) {
            this.defaultMemberPermissions = data.defaultMemberPermissions;
        }

        this.name = data.name;
        this.description = data.description;
        this.options = data.options;
        this.isPlayer = data.isPlayer;
        this.isCommandCategory = data.isCommandCategory;
        this.settings = data.settings;
        this.dmPermission = data.dmPermission;

        /**
         * 
         * @type {Function}
         * @param {Topokki} client
         * @param {CommandInteraction} interaction
         */
        this._callback = data.callback;

        /**
         * 
         * @type {Function}
         * @param {Topokki} client
         * @param {CommandInteraction} interaction
         */
        this.callback = this.cb;
    }

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    async cb(client, interaction) {
        await client.getSubcommand(interaction)?.callback?.(client, interaction);
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
     * @type {bigint[]}
     */
    defaultMemberPermissions = [];

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

        this.defaultMemberPermissions = data.defaultMemberPermissions;
        this.name = data.name;

        /**
         * 
         * @type {Function}
         * @param {Topokki} client
         * @param {CommandInteraction} interaction
         */
        this._callback = data.callback;

        /**
         * 
         * @type {Function}
         * @param {Topokki} client
         * @param {CommandInteraction} interaction
         */
        this.callback = this.cb;
    }

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    async cb(client, interaction) {
        const access = await client.validate(interaction, this.defaultMemberPermissions);
        if (access) {
            await this._callback(client, interaction);
        }
    }
}

module.exports = { Command, CommandSettings, CommandType, Subcommand };