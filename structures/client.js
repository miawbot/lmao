const discord = require('discord.js');
const fg = require('fast-glob');

const { Event } = require('./event');
const { Command } = require('./command');
const { Distube } = require('./distube');


class Client extends discord.Client {
    constructor() {
        super(
            {
                intents: [
                    discord.GatewayIntentBits.Guilds,
                    discord.GatewayIntentBits.MessageContent,
                    discord.GatewayIntentBits.GuildVoiceStates,
                    discord.GatewayIntentBits.GuildMessages,
                    discord.GatewayIntentBits.GuildMembers,
                    discord.GatewayIntentBits.DirectMessages,
                    discord.GatewayIntentBits.GuildInvites,
                ],
            },
        );
    }

    init() {
        this.login(process.env.CLIENT_TOKEN)
            .then(
                () => {
                    this.commands = new discord.Collection();
                    this.guildCommands = [];
                    this.globalCommands = [];

                    this.distube = new Distube(this);

                    this.registerCommands()
                        .then(
                            () => {
                                console.log('loaded commands');
                            },
                        );

                    this.registerEvents()
                        .then(
                            () => {
                                console.log('loaded events');
                            },
                        );
                },
            );
    }

    error(interaction, message) {
        return interaction.reply(
            {
                content: message,
                ephemeral: true,
            },
        );
    }

    mention(id) {
        return discord.userMention(id);
    }

    inline(string) {
        return discord.inlineCode(string);
    }

    async getChannelById(interaction, id) {
        return await interaction?.guild?.channels?.cache?.get(id);
    }

    async register(root, callback) {
        for (const path of await fg(`${root}/**/*.js`)) {
            const module = require(`.${path}`);
            callback(module);
        }
    }

    async registerCommands() {
        await this.register('./commands',
            (module) => {
                if (module instanceof Command) {
                    if ('owner_only' in module) {
                        module.default_permission = false;
                    }

                    const selector = 'guild_only' in module
                        ? 'guildCommands'
                        : 'globalCommands';

                    this[selector].push(module);
                    this.commands.set(module.name, module);
                }
            },
        );
    }

    async registerEvents() {
        await this.register('./events',
            (module) => {
                if (module instanceof Event) {
                    const listeners = {
                        'distube': this.distube,
                        'client': this,
                    };

                    listeners[module.module_type].on(module.name,
                        (...args) => {
                            module.run(this, ...args);
                        },
                    );
                }
            },
        );
    }

    async registerSlashCommands() {
        const slash = this.application?.commands;

        await slash
            .set(this.globalCommands)
            .then(
                () => {
                    console.log('global set');
                },
            );

        if (process.env.GUILD_ID) {
            await slash
                .set(this.guildCommands, process.env.GUILD_ID)
                .then(
                    () => {
                        console.log('guild set')
                    }
                );
        }
    }
}

module.exports = { Client };
