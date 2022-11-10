const discord = require('discord.js');
const fg = require('fast-glob');
const { Event } = require('./event');
const { Command } = require('./command');
const { Distube, DistubeEventType } = require('./distube');

class Client extends discord.Client {
    COMMAND_PATH = './modules/commands';
    EVENT_PATH = './modules/events';

    constructor() {
        super({
            intents: [
                discord.GatewayIntentBits.Guilds,
                discord.GatewayIntentBits.MessageContent,
                discord.GatewayIntentBits.GuildVoiceStates,
                discord.GatewayIntentBits.GuildMessages,
                discord.GatewayIntentBits.GuildMembers,
                discord.GatewayIntentBits.DirectMessages,
                discord.GatewayIntentBits.GuildInvites,
            ],
        });
    }

    init() {
        this.login(process.env.CLIENT_TOKEN).then(() => {
            this.commands = new discord.Collection();
            this.guildCommands = [];
            this.globalCommands = [];
            this.distube = new Distube(this);

            this.registerCommands();
            this.registerEvents();
        });
    }

    error(interaction, message) {
        return interaction.reply({
            content: message,
            ephemeral: true,
        });
    }

    async getChannelById(interaction, id) {
        return await interaction?.guild?.channels?.cache?.get(id);
    }

    registerCommands() {
        const modules = fg.sync(this.COMMAND_PATH + '**/**/*.js');

        for (const path of modules) {
            const command = require('.' + path);

            if (!(command instanceof Command)) {
                throw new Error('Module needs to be an instance of Command');
            }

            if (command.hasOwnProperty('owner_only')) {
                command.default_permission = false;
            }

            if (command.hasOwnProperty('guild_only')) {
                this.guildCommands.push(command);
            } else {
                this.globalCommands.push(command);
            }

            this.commands.set(command.name, command);
        }
    }

    registerEvents() {
        const modules = fg.sync(this.EVENT_PATH + '**/**/*.js');

        for (const path of modules) {
            const event = require('.' + path);

            if (!(event instanceof Event)) {
                throw new Error('Module needs to be an instance of Event');
            }

            let module = null;

            if (event.module_type instanceof ClientEventType) {
                module = this;
            }

            if (event.module_type instanceof DistubeEventType) {
                module = this.distube;
            }

            if (module) {
                module.on(event.name, (...args) => {
                    event.run(this, ...args);
                });
            }
        }
    }

    async registerSlashCommands() {
        const slash = this.application?.commands;

        if (slash) {
            // await slash.set(this.globalCommands);
            await slash.set(this.globalCommands, process.env.GUILD_ID);
        }
    }
}

class ClientType {
    constructor() {
        return this;
    }
}

class ClientEventType {
    constructor() {
        return this;
    }
}

module.exports = { Client, ClientEventType, ClientType };
