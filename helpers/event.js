class EventType {
    name = '';
    isPlayer = false;

    /**
     * @type {Function}
     */
    callback = null;
}

class Event extends EventType {
    
    /**
     * 
     * @param {EventType} data 
     */
    constructor(data) {
        super();

        if (
            !data.name ||
            !data.callback
        ) {
            throw new Error('Event module is missing properties');
        }

        data = Object.assign(new EventType(), data);

        this.name = data.name;
        this.isPlayer = data.isPlayer;
        this.callback = data.callback;
    }
}

module.exports = { Event };