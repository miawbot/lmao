const { Topokki } = require('../../structures/topokki');
const { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, roleMention, inlineCode } = require('discord.js');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    'name': 'welcome',
    'description': 'set up a welcome message when a user is invited to this server',
    'isPlayer': true,
    'ownerOnly': true,
    'options': [
        {
            'type': ApplicationCommandOptionType.SubcommandGroup,
            'name': 'message',
            'description': 'set up a welcome message',
            'options': [
                {
                    'type': ApplicationCommandOptionType.Subcommand,
                    'name': 'embed',
                    'description': 'create/update embed',
                    'options': [
                        {
                            'type': ApplicationCommandOptionType.String,
                            'name': 'title',
                            'description': 'set title',
                        },
                        {
                            'type': ApplicationCommandOptionType.String,
                            'name': 'description',
                            'description': 'set description',
                        },
                        {
                            'type': ApplicationCommandOptionType.String,
                            'name': 'color',
                            'description': 'provide a hex value',
                        },
                        {
                            'type': ApplicationCommandOptionType.String,
                            'name': 'image',
                            'description': 'provide an image url (e.g imgur)',
                        },
                        {
                            'type': ApplicationCommandOptionType.String,
                            'name': 'footer',
                            'description': 'set footer',
                        },
                        {
                            'type': ApplicationCommandOptionType.Boolean,
                            'name': 'timestamp',
                            'description': 'set timestamp',
                        },
                    ],
                },
                {
                    'type': ApplicationCommandOptionType.Subcommand,
                    'name': 'channel',
                    'description': 'provide a channel where welcome messages are sent',
                    'options': [
                        {
                            'type': ApplicationCommandOptionType.Channel,
                            'name': 'text_channel',
                            'description': 'provide a text channel',
                            'channel_types': [0],
                        },
                        {
                            'type': ApplicationCommandOptionType.Boolean,
                            'name': 'enabled',
                            'description': 'enable/disable welcome messages',
                        },
                    ],
                },
            ],
        },
        {
            'type': ApplicationCommandOptionType.SubcommandGroup,
            'name': 'role',
            'description': 'set up roles to be added to invited users alongside welcome messages',
            'options': [
                {
                    'type': ApplicationCommandOptionType.Subcommand,
                    'name': 'add',
                    'description': 'provide a role to be listed',
                    'options': [
                        {
                            'type': ApplicationCommandOptionType.Role,
                            'name': 'role',
                            'description': 'provide a role',
                            'required': true,
                        },
                    ],
                },
                {
                    'type': ApplicationCommandOptionType.Subcommand,
                    'name': 'remove',
                    'description': 'provide a role to removed from the list',
                    'options': [
                        {
                            'type': ApplicationCommandOptionType.Role,
                            'name': 'role',
                            'description': 'provide a role',
                            'required': true,
                        },
                    ],
                },
                {
                    'type': ApplicationCommandOptionType.Subcommand,
                    'name': 'list',
                    'description': 'display configured welcome roles',
                },
            ],
        },
    ],

    /**
     * 
     * @param {Topokki} client 
     * @param {CommandInteraction} interaction 
     */
    async callback(client, interaction) {
        const WelcomeMessage = client.database.get('welcomeMessage');
        const WelcomeRole = client.database.get('welcomeRole');

        if (client.routing(interaction, 'message', 'embed')) {
            const options = client.sanitize({
                'title': interaction.options.getString('title'),
                'description': interaction.options.getString('description'),
                'color': interaction.options.getString('color'),
                'image': interaction.options.getString('image'),
                'footer': interaction.options.getString('footer'),
                'timestamp': interaction.options.getBoolean('timestamp'),
            });

            if (!Object.keys(options).length) {
                client.reply(interaction, 'no options were provided');
                return;
            }

            const embed = await WelcomeMessage.findOne({ 'guildId': interaction.guildId });

            if (embed) {
                await WelcomeMessage.findOneAndUpdate(
                    { 'guildId': interaction.guildId },
                    { '$set': options }
                );

                interaction.reply('welcome message embed has been updated')
                return;
            }

            if (
                !options.description ||
                !options.title
            ) {
                client.reply(interaction, 'there must be at least one description and title inside the welcome message embed');
                return;
            }

            if (
                options.color &&
                !options.color.match(/^#[a-f0-9]{6}$/i)
            ) {
                client.reply(interaction, 'option color must be of a proper hex format');
                return;
            }

            await WelcomeMessage.create({
                'guildId': interaction.guildId,
                'isEnabled': true,
                ...options,
            });

            interaction.reply('welcome message embed has been created');
            return;
        };

        if (client.routing(interaction, 'message', 'channel')) {
            const options = client.sanitize({
                'channelId': interaction.options.getChannel('text_channel')?.id,
                'isEnabled': interaction.options.getBoolean('enabled')
            });

            if (!Object.keys(options).length) {
                client.reply(interaction, 'no options were provided');
                return;
            }

            const embed = await WelcomeMessage.findOne({ 'guildId': interaction.guildId });

            if (!embed) {
                client.reply(interaction, 'oops, welcome messages might be disabled or no embed has been set');
                return;
            }

            await WelcomeMessage.findOneAndUpdate(
                { 'guildId': interaction.guildId },
                { '$set': options }
            );

            interaction.reply('welcome message channel have been updated');
            return;
        };

        if (client.routing(interaction, 'role', 'add')) {
            const role = interaction.options.getRole('role');

            const _role = await WelcomeRole.findOne({
                'guildId': interaction.guildId,
                'roleId': role.id
            });

            if (_role) {
                client.reply(interaction, `role ${inlineCode(role.name)} is already set as a welcome role`);
                return;
            }

            await WelcomeRole.create({
                'guildId': interaction.guildId,
                'roleId': role.id
            })

            interaction.reply(`added role ${inlineCode(role.name)} to welcome roles`);
            return;
        }

        if (client.routing(interaction, 'role', 'remove')) {
            const role = interaction.options.getRole('role');

            await WelcomeRole.findOneAndDelete({
                'guildId': interaction.guildId,
                'roleId': role.id,
            })

            interaction.reply(`removed role ${inlineCode(role.name)} from welcome roles`);
            return;
        }

        if (client.routing(interaction, 'role', 'list')) {
            const _roles = await WelcomeRole.find({ 'guildId': interaction.guildId }) || [];

            const roles = [];
            for (const role of _roles) {
                if (interaction.member.guild.roles.cache.get(role.roleId)) {
                    roles.push(roleMention(role.roleId));
                };
            }

            let description = roles.length
                ? `these are the set welcome roles: ${roles.join(', ')}`
                : `no roles found. use ${inlineCode('/welcome roles add')} to add a welcome role`;

            const embed = new EmbedBuilder()
                .setTitle('welcome roles')
                .setDescription(description);

            interaction.reply({ 'embeds': [embed] });
        }
    },
});
