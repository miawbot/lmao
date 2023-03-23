const fg = require('fast-glob');
const { Client, GatewayIntentBits, Collection, CommandInteraction, VoiceChannel, userMention, inlineCode, InteractionResponse, roleMention, channelMention } = require('discord.js');
const { Command } = require('../helpers/command');
const { Event } = require('../helpers/event');
const { Player } = require('./player');
const { Database } = require('./database');

class Topokki extends Client {

    constructor() {
        super({
            intents: [
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

        /**
         * mongoose database instance
         * 
         * @type {Database}
         */
        this.database = new Database();
        this.database.connect(process.env.MONGO_URI);

        this.voiceChannelCache = new Collection();
        this.commands = new Collection();
        this.player = new Player(this);
    }

    init() {
        this.loadCommands();
        this.loadEvents();
        this.loadSchemas();

        this.login(process.env.CLIENT_TOKEN).then(() => console.log('client is online'));
    }

    /**
     * 
     * @param {String} str
     * @returns {Boolean}
     */
    isHex(str) {
        return str.match(/^#[a-f0-9]{6}$/i) !== null;
    }

    /**
     * 
     * @param {string} id 
     * @returns {string}
     */
    mention(type, id) {
        return {
            'channel': channelMention(id),
            'role': roleMention(id),
            'user': userMention(id),
        }[type] ?? id;
    }

    /**
     * 
     * @param {string} string 
     * @returns {string}
     */
    inline(string) {
        return inlineCode(string);
    }

    /**
     * send an ephemeral message to the channel where the interaction is being fired
     * 
     * @param {CommandInteraction} interaction 
     * @param {string} content 
     * @param {string[]} options
     * @returns {Promise<InteractionResponse>}
     */
    reply(interaction, content, options = { ephemeral: true }) {
        if (interaction.deferred || interaction.replied) {
            return interaction.editReply({ content, ...options })
        }

        return interaction.reply({ content, ...options });
    }

    /**
     * 
     * @param {string} name 
     * @returns {Command}
     */
    getCommand(name) {
        return this.commands.get(name);
    }

    /**
     * 
     * @returns {VoiceChannel|false}
     */
    getCurrentVoiceChannel(interaction) {
        return interaction.member?.voice?.channel;
    }

    /**
     * 
     * @param {Command} command 
     */
    loadCommand(command) {
        if (command instanceof Command) {
            this.commands.set(command.name, command);
        }
    }

    /**
     * 
     * @param {Event} event 
     */
    loadEvent(event) {
        if (event instanceof Event) {
            const listener = event.isPlayer ? this.player : this;
            listener.on(event.name, (...args) => event.callback(this, ...args));
        }
    }

    loadCommands() {
        for (const path of fg.sync('./commands/**/*.js')) {
            try {
                const file = require(`.${path}`);
                this.loadCommand(file)
            } catch (err) {
                console.log(`skipped ${path} due to: ${err}`)
            }
        }
    }

    loadEvents() {
        for (const path of fg.sync('./events/**/*.js')) {
            try {
                const file = require(`.${path}`);
                this.loadEvent(file);
            } catch (err) {
                console.log(`skipped ${path} due to: ${err}`)
            }
        }
    }

    loadSchemas() {
        for (const path of fg.sync('./models/*.js')) {
            const file = require(`.${path}`);
            this.database.set(file.name, file.model)
        }
    }

    /**
     * option wrapper for easier use
     * 
     * @param {CommandInteraction} interaction 
     * @param {string[]} options 
     * @returns
     */
    options(interaction, options) {
        const temp = {};
        for (let prop in options) {
            prop = interaction.options.get(prop);
            if (prop !== null && prop !== undefined) {
                temp[prop] = prop;
            }
        }

        return temp;
    }

    async registerCommands() {
        const slash = this.application?.commands;
        if (slash) {
            await slash.set([...this.commands.values()]);
        }
    }
}

const client = new Topokki();

module.exports = { client, Topokki };