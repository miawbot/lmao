const fg = require('fast-glob');
const { Client, GatewayIntentBits, Collection, CommandInteraction, InteractionResponse } = require('discord.js');
const { Command } = require('../helpers/command');
const { Event } = require('../helpers/event');
const { Player } = require('./player');
const { Database } = require('./database');

class Topokki extends Client {

    /**
     * Topokki main instance
     */
    constructor() {
        super({
            'intents': [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.GuildMembers,
            ]
        })

        this.instance = this;
        this.database = new Database();
        this.voiceChannelCache = new Collection();
        this.commands = new Collection();
        this.player = new Player(this);
    }

    /**
     * Load dependencies and other stuff 
     */
    init() {
        this.loadCommands();
        this.loadEvents();

        this.database.connect(process.env.MONGO_URI);
        this.loadSchemas();

        this.login(process.env.CLIENT_TOKEN).then(() => console.log('Client is online'));
    }

    /**
     * Validated command routing
     * 
     * @param {CommandInteraction} interaction 
     * @param {String} group 
     * @param {String} sub 
     * @param {Function} callback
     * @returns {Boolean}
     */
    routing(interaction, group, sub = null) {
        const _group = interaction.options.getSubcommandGroup();
        const _sub = interaction.options.getSubcommand();

        if (
            _group === group &&
            _sub === sub
        ) {
            return true;
        }

        if (
            _group === null &&
            sub === null &&
            _sub === group
        ) {
            return true;
        }

        return false;
    }

    /**
     * Send a message to a channel where the author has interacted
     * 
     * @param {CommandInteraction} interaction 
     * @param {String} content 
     * @param {Object} options
     * @returns {Promise<InteractionResponse>}
     */
    reply(interaction, content, options = { 'ephemeral': true }) {
        const { deferred, replied } = interaction;

        const method = deferred || replied
            ? 'editReply'
            : 'reply';

        return interaction[method]?.({ content, ...options });
    }

    /**
     * Removes keys with nullish and undefined values
     * 
     * @param {Object} options 
     * @returns {Object}
     */
    sanitize(options) {
        return Object.fromEntries(Object.entries(options).filter(([_, v]) => v != null || v != undefined));
    }

    /**
     * Load commands
     */
    async loadCommands() {
        for (const f of await fg('./commands/**/*.js')) {
            const cmd = require('.' + f);
            if (cmd instanceof Command) {
                this.commands.set(cmd.name, cmd);
            };
        }
    }

    /**
     * Load events
     */
    async loadEvents() {
        for (const f of await fg('./events/**/*.js')) {
            const evt = require('.' + f);
            if (evt instanceof Event) {
                const _this = evt.isPlayer
                    ? this.player
                    : this;

                _this.on(evt.name, (...args) => evt.callback(this, ...args));
            }
        }
    }

    /**
     * Load Mongoose schemas
     */
    async loadSchemas() {
        for (const f of await fg('./models/*.js')) {
            const { name, model } = require('.' + f);
            this.database.set(name, model)
        }
    }

    /**
     * Register commands to Discord
     */
    async registerCommands() {
        const slash = this.application?.commands;

        if (slash) {
            await slash.set([...this.commands.values()]);
        }
    }
}

const client = new Topokki();

module.exports = { client, Topokki };