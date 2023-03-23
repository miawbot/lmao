const { Topokki } = require('../../structures/topokki');
const { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder } = require('discord.js');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    name: 'welcome',
    description: 'set up a welcome message when a user is invited to this server',
    isPlayer: true,
    ownerOnly: true,
    options: [
        {
            type: ApplicationCommandOptionType.SubcommandGroup,
            name: 'message',
            description: 'set up a welcome message',
            options: [
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: 'embed',
                    description: 'create/update embed',
                    options: [
                        {
                            type: ApplicationCommandOptionType.String,
                            name: 'title',
                            description: 'set title',
                        },
                        {
                            type: ApplicationCommandOptionType.String,
                            name: 'description',
                            description: 'set description',
                        },
                        {
                            type: ApplicationCommandOptionType.String,
                            name: 'color',
                            description: 'provide a hex value',
                        },
                        {
                            type: ApplicationCommandOptionType.String,
                            name: 'image',
                            description: 'provide an image url (e.g imgur)',
                        },
                        {
                            type: ApplicationCommandOptionType.String,
                            name: 'footer',
                            description: 'set footer',
                        },
                        {
                            type: ApplicationCommandOptionType.Boolean,
                            name: 'timestamp',
                            description: 'set timestamp',
                        },
                    ],
                },
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: 'channel',
                    description: 'provide a channel where welcome messages are sent',
                    options: [
                        {
                            type: ApplicationCommandOptionType.Channel,
                            name: 'text_channel',
                            description: 'provide a text channel',
                            channel_types: [0],
                        },
                        {
                            type: ApplicationCommandOptionType.Boolean,
                            name: 'enabled',
                            description: 'enable/disable welcome messages',
                        },
                    ],
                },
            ],
        },
        {
            type: ApplicationCommandOptionType.SubcommandGroup,
            name: 'role',
            description: 'set up roles to be added to invited users alongside welcome messages',
            options: [
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: 'add',
                    description: 'provide a role to be listed',
                    options: [
                        {
                            type: ApplicationCommandOptionType.Role,
                            name: 'role',
                            description: 'provide a role',
                            required: true,
                        },
                    ],
                },
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: 'remove',
                    description: 'provide a role to removed from the list',
                    options: [
                        {
                            type: ApplicationCommandOptionType.Role,
                            name: 'role',
                            description: 'provide a role',
                            required: true,
                        },
                    ],
                },
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: 'show',
                    description: 'display configured welcome roles',
                },
            ],
        },
    ],

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    callback(client, interaction) {
        const subcommandGroup = interaction.options.getSubcommandGroup();
        const subcommand = interaction.options.getSubcommand();

        const WelcomeMessage = client.database.get('welcomeMessage');

        if (subcommandGroup === 'message') {
            if (subcommand === 'embed') {
                const options = client.options(interaction, ['title', 'description', 'color', 'image', 'footer', 'timestamp']);

                if (!Object.keys(options).length) {
                    client.reply(interaction, 'no options were provided');
                    return;
                }

                WelcomeMessage.findOne({ guildId: interaction.guildId }).then((message) => {
                    if (message === null) {
                        if (
                            !options.description ||
                            !options.title
                        ) {
                            client.reply(interaction, 'there must be at least one description and title inside the welcome message embed');
                            return;
                        }

                        if (
                            options.color &&
                            client.isHex(options.color)
                        ) {
                            client.reply(interaction, 'option color must be of a proper hex format');
                            return;
                        }

                        WelcomeMessage.create({
                            guildId: interaction.guildId,
                            isEnabled: true,
                            ...options,
                        });

                        interaction.reply('welcome message embed has been created');
                        return;
                    }

                    WelcomeMessage.findOneAndUpdate({ guildId: interaction.guildId }, { $set: options }).then(() => {
                        interaction.reply('welcome message embed has been updated');
                        return;
                    });
                });
            }

            if (subcommand === 'channel') {
                const options = client.options(interaction, ['enabled', 'text_channel']);

                if (!Object.keys(options).length) {
                    client.reply(interaction, 'no options were provided');
                    return;
                }

                WelcomeMessage.findOne({ guildId: interaction.guildId }).then((message) => {
                    if (!message) {
                        client.reply(interaction, 'this command is not available since no welcome message embed has been set');
                        return;
                    }
                });

                const $set = {
                    isEnabled: options.enabled,
                    channelId: options.text_channel.id
                }

                WelcomeMessage.findOneAndUpdate({ guildId: interaction.guildId }, { $set }).then(() => {
                    interaction.reply('welcome message channel have been updated');
                    return;
                });
            }
        }

        const WelcomeRole = client.database.get('welcomeRole');

        if (subcommandGroup === 'role') {
            if (subcommand === 'add') {
                const options = client.options(interaction, ['role']);
                const roleId = options.role.id;

                WelcomeRole.findOne({ guildId: interaction.guildId, roleId }).then((role) => {
                    if (role) {
                        client.reply(interaction, `role ${client.inline(role.name)} is already set as a welcome role`);
                        return;
                    }

                    WelcomeRole.create({ guildId: interaction.guildId, roleId }).then(() => {
                        interaction.reply(`added role ${client.inline(role.name)} to welcome roles`);
                        return;
                    });
                });
            }

            if (subcommand === 'remove') {
                const options = client.options(interaction, ['role']);

                WelcomeRole.findOneAndDelete({ guildId: interaction.guildId, roleId: options.role.id, }).then(() => {
                    interaction.reply(`removed role ${client.inline(options.role.name)} from welcome roles`);
                    return;
                });
            }

            if (subcommand === 'show') {
                WelcomeRole.find({ guildId: interaction.guildId }).then((_roles) => {
                    let roles = [];

                    if (_roles) {
                        for (const role of _roles) {
                            if (interaction.member.guild.roles.cache.get(role.roleId)) {
                                roles.push(client.mention('role', role.roleId));
                            }
                        }
                    }

                    let description = `these are the set welcome roles: ${roles.join(', ')}`;

                    if (!roles.length) {
                        description = `no roles found. use ${client.inline('/welcome roles add')} to add a welcome role`;
                    }

                    const embed = new EmbedBuilder()
                        .setTitle('welcome roles')
                        .setDescription(description);

                    interaction.reply({ embeds: [embed] });
                });
            }
        }
    },
});
