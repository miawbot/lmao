const fg = require('fast-glob');
const { Client, GatewayIntentBits, Collection, CommandInteraction, VoiceChannel, userMention, inlineCode } = require('discord.js');
const { Command } = require('./command');
const { Event } = require('./event');
const { Player } = require('./player');

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

        this.commands = new Collection();
        this.player = new Player(this);
    }

    static instance() {
        return new this();
    }

    init() {
        this.loadCommands();
        this.loadEvents();
        this.login(process.env.CLIENT_TOKEN).then(() => console.log('client is online'));
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
     * 
     * @param {CommandInteraction} interaction 
     * @param {string} message 
     * @returns {Promise<>}
     */
    userOnly(interaction, message) {
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
     * @returns {VoiceChannel | false}
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

    async registerCommands() {
        const slash = this.application?.commands;
        if (slash) {
            await slash.set([...this.commands.values()]);
        }
    }
}

module.exports = Bibimbap;