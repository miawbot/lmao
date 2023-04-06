const fg = require('fast-glob');
const { Client, GatewayIntentBits, Collection, CommandInteraction, InteractionResponse, inlineCode, EmbedBuilder } = require('discord.js');
const { Command, Subcommand } = require('../helpers/command');
const { Event } = require('../helpers/event');
const { Player } = require('./player');
const { Database } = require('./database');
const { Cron } = require('../helpers/cron');

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
                GatewayIntentBits.GuildModeration,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.GuildPresences
            ]
        })

        this.instance = this;
        this.database = new Database();
        this.crons = new Collection();
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
    async init() {
        await this.loadCommands();
        this.loadEvents().then(() => console.log('Events have been loaded'));

        this.database.connect(process.env.MONGO_URI);
        await this.loadSchemas();
        await this.loadCrons();

        this.login(process.env.CLIENT_TOKEN).then(() => console.log('Client is online'));
    }

    /**
     * Get current relative subcommand that responds to the related interaction
     * 
     * @param {CommandInteraction} interaction 
     * @returns {Subcommand|undefined}
     */
    getSubcommand(interaction) {
        const options = this.sanitize([
            interaction.commandName,
            interaction.options.getSubcommandGroup(),
            interaction.options.getSubcommand()
        ]);

        return this.subcommands.get(options.join('.'));
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
     * @param {Object|String[]} data 
     * @returns {Object}
     */
    sanitize(data) {
        if (Array.isArray(data)) {
            return data.filter(Boolean);
        }

        return Object.fromEntries(Object.entries(data).filter(([_, v]) => v != null || v != undefined));
    }

    /**
     * Checks permissions for subcommands
     * 
     * @param {CommandInteraction} interaction 
     * @returns {Boolean}
     */
    async validate(interaction, perms = []) {
        const _perms = interaction.member.permissions;

        if (!_perms.has(perms)) {
            await client.reply(interaction, 'U have insufficient permissions to use this command');
            return false;
        }

        return true;
    }

    /**
     * Load Cronjobs
     */
    async loadCrons() {
        for (const file of await fg('./cron/*.js')) {
            const cron = require('.' + file);
            if (cron instanceof Cron) {
                cron.start(client);
                this.crons.set(cron.name, cron);
            }
        }
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
        for (const file of await fg('./models/**/**/*.js')) {
            const { name, model } = require('.' + file);
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