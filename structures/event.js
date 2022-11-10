const { Module } = require('./module');
const { DistubeEventType } = require('./distube');
const { ClientEventType } = require('./client');

class Event extends Module {
    /**
     *
     * @param name {string} event name in relation to module_type
     * @param module_type {ClientEventType | DistubeEventType}
     * @param run {function}
     */
    constructor({ name, module_type, run }) {
        super({
            types: [
                DistubeEventType,
                ClientEventType,
            ],
            module_type: module_type,
        });

        if (
            !name ||
            !module_type ||
            !run
        ) {
            throw new Error('Event module is missing properties');
        }

        this.name = name;
        this.module_type = module_type;
        this.run = run;
    }
}

module.exports = { Event };