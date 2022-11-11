class Event {
    constructor(
        {
            name,
            module_type = 'client',
            run,
        },
    ) {
        if (!name || !run) {
            throw new Error('event module is missing properties');
        }

        if (['distube', 'client'].includes(module_type) === false) {
            throw new Error('event module is not recognized or is empty');
        }

        this.name = name;
        this.module_type = module_type;
        this.run = run;
    }
}

module.exports = { Event };