const mongoose = require('mongoose');
const { Collection } = require('discord.js');

class Database {

    /**
     * Mongoose wrapper
     */
    constructor() {
        mongoose.set('strictQuery', false); // Safe prep for mongoose 7.0

        this.schemas = new Collection();
    }

    /**
     * Connect to mongoose database
     * 
     * @param {String|null} uri
     * @returns {Promise<mongoose>}
     */
    async connect(uri = '') {
        return mongoose.connect(uri, { 'keepAlive': true, });
    }

    /**
     * Create a new schema in the mongoose database
     * 
     * @param {String} name 
     * @param {Object} model 
     * @returns {{ name: String, model: mongoose.Model }}
     */
    schema(name, model) {
        return { name, 'model': mongoose.model(name, new mongoose.Schema(model)) };
    }

    /**
     * Store Mongoose schema in local
     * 
     * @param {String} name 
     * @param {mongoose.Model} model 
     */
    set(name, model) {
        this.schemas.set(name, model);
    }

    /**
     * Get schema
     * 
     * @param {String} name 
     * @returns {mongoose.Model}
     */
    get(name) {
        return this.schemas.get(name);
    }
}

module.exports = { Database };