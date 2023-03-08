const fg = require('fast-glob');
const { Client, GatewayIntentBits, Collection, CommandInteraction, VoiceChannel, userMention, inlineCode, InteractionResponse } = require('discord.js');
const { Command } = require('../helpers/command');
const { Event } = require('../helpers/event');
const { Player } = require('./player');
const { Database } = require('../structures/database');

class Bibimbap extends Client {

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

        this.voiceChannelCache = new Collection();
        this.commands = new Collection();
        this.player = new Player(this);
    }

    init() {
        this.loadCommands();
        this.loadEvents();

        this.database.connect(process.env.MONGO_URI);
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
    mention(id) {
        return userMention(id);
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
     * @param {string} message 
     * @returns {Promise<InteractionResponse>}
     */
    notification(interaction, message) {
        return interaction.reply({ content: message, ephemeral: true, });
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
     * filters object undefined/null values and returns filtered
     * 
     * @param {Object} object 
     * @returns 
     */
    sanitizeObject(object) {
        const temp = {};

        for (const prop in object) {
            if (
                object[prop] !== null &&
                object[prop] !== undefined
            ) {
                temp[prop] = object[prop];
            }
        }

        return temp;
    }

    async registerCommands() {
        const slash = this.application?.commands;
        if (slash) {
            await slash.set([...this.commands.values()]);
            // if (process.env.GUILD_ID) {
            //     await this.application.commands.set([...this.commands.values()], process.env.GUILD_ID);
            // }
        }
    }
}

const client = new Bibimbap();

module.exports = { client, Bibimbap };