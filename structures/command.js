const { Module } = require('./module');
const { DistubeType } = require('./distube');
const { ClientType } = require('./client');

class Command extends Module {
    /**
     *
     * @param name {string} slash command name
     * @param description {string} slash command description
     * @param options {object[]} slash command option fields to be rendered to the command
     * @param module_type {DistubeType | ClientType} extended data for advanced modules
     * @param run {function} slash command function
     */
    constructor({ name, description, options = [], module_type = null, run }) {
        super({
            types: [
                DistubeType,
                ClientType,
            ],
            module_type: module_type,
        });

        if (
            !name ||
            !description ||
            !run
        ) {
            throw new Error('Command module is missing properties');
        }

        this.module_type = module_type;
        this.name = name;
        this.description = description;
        this.options = options;
        this.run = run;
    }
}

module.exports = { Command };