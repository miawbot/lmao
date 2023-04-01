const fg = require('fast-glob');
const { Client, GatewayIntentBits, Collection, CommandInteraction, InteractionResponse } = require('discord.js');
const { Command, Subcommand } = require('../helpers/command');
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
        this.botPreventionCache = new Collection();

        /**
         * @type {Collection<String, Command>}
         */
        this.commands = new Collection();

        /**
         * @type {Collection<String, Subcommand>}
         */
        this.subcommands = new Collection();

        this.player = new Player(this);
    }

    /**
     * Load dependencies and other stuff 
     */
    init() {
        this.loadCommands();
        this.loadEvents().then(() => console.log('Events have been loaded'));

        this.database.connect(process.env.MONGO_URI);
        this.loadSchemas();

        this.login(process.env.CLIENT_TOKEN).then(() => console.log('Client is online'));
    }

    /**
     * Get current relative subcommand that responds to the related interaction
     * 
     * @param {CommandInteraction} interaction 
     * @returns {Subcommand|undefined}
     */
    getSubcommand(interaction) {
        const options = {
            '1': interaction.commandName,
            '2': interaction.options.getSubcommandGroup(),
            '3': interaction.options.getSubcommand()
        };

        let route = Object.values(this.sanitize(options)).join('.');

        return this.subcommands.get(route);
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
        for (const file of await fg('./commands/**/**/**/*.js')) {
            const command = require('.' + file);
            if (
                command instanceof Command ||
                command instanceof Subcommand
            ) {
                let _this = command?.constructor === Subcommand
                    ? this.subcommands
                    : this.commands;

                _this.set(command.name, command);
            }
        }
    }

    /**
     * Load events
     */
    async loadEvents() {
        for (const file of await fg('./events/**/*.js')) {
            const event = require('.' + file);

            if (event instanceof Event) {
                const _this = event.isPlayer
                    ? this.player
                    : this;

                _this.on(event.name, (...args) => event.callback(this, ...args));
            }
        }
    }

    /**
     * Load Mongoose schemas
     */
    async loadSchemas() {
        for (const f of await fg('./models/**/*.js')) {
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