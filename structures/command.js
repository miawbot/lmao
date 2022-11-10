class Command {
    constructor({
        name,
        description,
        options = [],
        module_type = 'client',
        restraints = {
            require_in_voice_channel: true,
            require_shared_voice_channel: false,
        },
        run,
    }) {
        if (
            !name ||
            !description ||
            !run
        ) {
            throw new Error('Command module is missing properties');
        }

        if (['distube', 'client'].includes(module_type) === false) {
            throw new Error('Event module is not recognized or is empty');
        }

        this.module_type = module_type;
        this.restraints = restraints;
        this.name = name;
        this.description = description;
        this.options = options;
        this.run = run;
    }
}

module.exports = { Command };