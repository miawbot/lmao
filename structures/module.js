class Module {
    constructor({ types, module_type }) {
        if (module_type) {
            for (const type of types) {
                if (!(module_type instanceof type)) {
                    throw new Error('Event module is not recognized or is empty');
                }
            }
        }
    }
}

module.exports = { Module }