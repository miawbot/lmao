class CommandSettingsType {
    voiceChannel = false;
    sharedVoiceChannel = false;
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

    /**
     * @type {CommandSettings}
     */
    settings = {};

    /**
     * @type Function
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

        this.name = data.name;
        this.description = data.description;
        this.options = data.options;
        this.isPlayer = data.isPlayer;
        this.settings = data.settings;
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