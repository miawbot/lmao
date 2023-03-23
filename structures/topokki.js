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
     * Check if string is hex
     * 
     * @param {String} str 
     * @returns 
     */
    isHex(str) {
        return str.match(/^#[a-f0-9]{6}$/i) !== null;
    }

    /**
     * Format string
     * 
     * @param {String} type 
     * @param {String} id 
     * @returns 
     */
    mention(type, id) {
        const obj = {
            channel: channelMention(id),
            role: roleMention(id),
            user: userMention(id)
        }

        return obj?.[type];
    }

    /**
     * Format string
     * 
     * @param {String} string 
     * @returns 
     */
    inline(string) {
        return inlineCode(string);
    }

    /**
     * Send a message to a channel where the author has interacted
     * 
     * @param {CommandInteraction} interaction 
     * @param {String} content 
     * @param {Object} options
     * @returns {Promise<InteractionResponse>}
     */
    reply(interaction, content, options = { ephemeral: true }) {
        if (interaction.deferred || interaction.replied) {
            return interaction.editReply({ content, ...options })
        }

        return interaction.reply({ content, ...options });
    }

    /**
     * Get current voice channel
     * 
     * @returns {VoiceChannel|null}
     */
    getCurrentVoiceChannel(interaction) {
        return interaction.member?.voice?.channel;
    }

    loadCommand(command) {
        if (command instanceof Command) {
            this.commands.set(command.name, command);
        }
    }

    loadEvent(event) {
        if (event instanceof Event) {
            const listener = event.isPlayer ? this.player : this;
            listener.on(event.name, (...args) => event.callback(this, ...args));
        }
    }

    loadCommands() {
        for (const path of fg.sync('./commands/**/*.js')) {
            const file = require(`.${path}`);
            this.loadCommand(file)
        }
    }

    loadEvents() {
        for (const path of fg.sync('./events/**/*.js')) {
            const file = require(`.${path}`);
            this.loadEvent(file);
        }
    }

    loadSchemas() {
        for (const path of fg.sync('./models/*.js')) {
            const file = require(`.${path}`);
            this.database.set(file.name, file.model)
        }
    }

    /**
     * Filter command interaction options
     * 
     * @param {CommandInteraction} interaction 
     * @param {String[]} options 
     * @returns 
     */
    getOptions(interaction, options) {
        const temp = {};
        for (let _prop of options) {
            let prop = interaction.options.get(_prop);
            if (prop !== null && prop !== undefined) {
                temp[prop.name] = prop.value;
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