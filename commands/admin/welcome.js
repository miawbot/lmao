const { Bibimbap } = require('../../structures/bibimbap');
const { ApplicationCommandOptionType, CommandInteraction } = require('discord.js');
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
        // {
        //     type: ApplicationCommandOptionType.SubcommandGroup,
        //     name: 'role',
        //     description: 'set up roles to be added to invited users alongside welcome messages',
        //     options: [
        //         {
        //             type: ApplicationCommandOptionType.Subcommand,
        //             name: 'add',
        //             description: 'provide a role to be listed',
        //             options: [
        //                 {
        //                     type: ApplicationCommandOptionType.Role,
        //                     name: 'role',
        //                     description: 'provide a role',
        //                     required: true,
        //                 },
        //             ],
        //         },
        //         {
        //             type: ApplicationCommandOptionType.Subcommand,
        //             name: 'remove',
        //             description: 'provide a role to removed from the list',
        //             options: [
        //                 {
        //                     type: ApplicationCommandOptionType.Role,
        //                     name: 'role',
        //                     description: 'provide a role',
        //                     required: true,
        //                 },
        //             ],
        //         },
        //         {
        //             type: ApplicationCommandOptionType.Subcommand,
        //             name: 'roles',
        //             description: 'display configured welcome roles',
        //         },
        //     ],
        // },
    ],

    /**
     * 
     * @param {Bibimbap} client 
     * @param {CommandInteraction} interaction 
     */
    callback(client, interaction) {
        const subcommandGroup = interaction.options.getSubcommandGroup();
        const subcommand = interaction.options.getSubcommand();

        const WelcomeMessage = client.database.get('welcomeMessage');

        if (subcommandGroup === 'message') {
            if (subcommand === 'embed') {
                const options = client.sanitizeObject({
                    title: interaction.options.getString('title'),
                    description: interaction.options.getString('description'),
                    color: interaction.options.getString('color'),
                    image: interaction.options.getString('image'),
                    footer: interaction.options.getString('footer'),
                    timestamp: interaction.options.getBoolean('timestamp'),
                });

                if (!Object.keys(options).length) {
                    client.notification(interaction, 'no options were provided');
                    return;
                }

                WelcomeMessage.findOne({ guildId: interaction.guildId }, function (err, doc) {
                    if (err) return;

                    if (doc === null) {
                        if (
                            !options.description ||
                            !options.title
                        ) {
                            client.notification(interaction, 'there must be at least one description and title inside the welcome message embed');
                            return;
                        }

                        if (
                            (options.color && client.isHex(options.color)) ||
                            options.color === 'none'
                        ) {
                            client.notification(interaction, 'option color must be of a proper hex format');
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

                    WelcomeMessage.findOneAndUpdate({ guildId: interaction.guildId }, { $set: options }, {}, function (err, doc) {
                        if (err) return;

                        interaction.reply('welcome message embed has been updated');
                        return;
                    });
                });
            }

            if (subcommand === 'channel') {
                WelcomeMessage.findOne({ guildId: interaction.guildId }, function (err, doc) {
                    if (err) return;

                    if (doc === null) {
                        client.notification(interaction, 'this command is not available since no welcome message embed has been set');
                        return;
                    }
                });

                const options = client.sanitizeObject({
                    channelId: interaction.options.getChannel('text_channel')?.id,
                    isEnabled: interaction.options.getBoolean('enabled'),
                });

                if (!Object.keys(options).length) {
                    client.notification(interaction, 'no options were provided');
                    return;
                }

                WelcomeMessage.findOneAndUpdate({ guildId: interaction.guildId }, { $set: options }, {}, function (err, doc) {
                    if (err) return;

                    interaction.reply('welcome message channel have been updated');
                    return;
                });
            }
        }
    },
});
