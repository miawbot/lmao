const { Topokki } = require('../../structures/topokki');
const { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, roleMention, inlineCode } = require('discord.js');
const { Command } = require('../../helpers/command');

module.exports = new Command({
    'name': 'welcome',
    'description': 'Set up a welcome message when a user is invited to this server',
    'isPlayer': true,
    'ownerOnly': true,
    'options': [
        {
            'type': ApplicationCommandOptionType.SubcommandGroup,
            'name': 'message',
            'description': 'Welcome message settings',
            'options': [
                {
                    'type': ApplicationCommandOptionType.Subcommand,
                    'name': 'embed',
                    'description': 'Create/update welcome message embed',
                    'options': [
                        {
                            'type': ApplicationCommandOptionType.String,
                            'name': 'title',
                            'description': 'Set a title',
                        },
                        {
                            'type': ApplicationCommandOptionType.String,
                            'name': 'description',
                            'description': 'Set a description',
                        },
                        {
                            'type': ApplicationCommandOptionType.String,
                            'name': 'color',
                            'description': 'Provide a hex value',
                        },
                        {
                            'type': ApplicationCommandOptionType.String,
                            'name': 'image',
                            'description': 'Provide an image url (e.g imgur)',
                        },
                        {
                            'type': ApplicationCommandOptionType.String,
                            'name': 'footer',
                            'description': 'Set a footer',
                        },
                        {
                            'type': ApplicationCommandOptionType.Boolean,
                            'name': 'timestamp',
                            'description': 'Enable/disable timestamp',
                        },
                    ],
                },
                {
                    'type': ApplicationCommandOptionType.Subcommand,
                    'name': 'channel',
                    'description': 'Welcome channel settings',
                    'options': [
                        {
                            'type': ApplicationCommandOptionType.Channel,
                            'name': 'text_channel',
                            'description': 'Provide a text channel where welcome messages can be sent to',
                            'channel_types': [0],
                        },
                        {
                            'type': ApplicationCommandOptionType.Boolean,
                            'name': 'enabled',
                            'description': 'Enable/disable welcome messages',
                        },
                    ],
                },
            ],
        },
        {
            'type': ApplicationCommandOptionType.SubcommandGroup,
            'name': 'role',
            'description': 'Welcome role settings',
            'options': [
                {
                    'type': ApplicationCommandOptionType.Subcommand,
                    'name': 'set',
                    'description': 'Add a new role to be given to newcomers',
                    'options': [
                        {
                            'type': ApplicationCommandOptionType.Role,
                            'name': 'role',
                            'description': 'Provide a role',
                            'required': true,
                        },
                    ],
                },
                {
                    'type': ApplicationCommandOptionType.Subcommand,
                    'name': 'unset',
                    'description': 'Unset a welcome role',
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
                    'description': 'Show a list of every welcome role that has been set',
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
                client.reply(interaction, 'No options were provided');
                return;
            }

            const embed = await WelcomeMessage.findOne({ 'guildId': interaction.guildId });

            if (embed) {
                await WelcomeMessage.findOneAndUpdate(
                    { 'guildId': interaction.guildId },
                    { '$set': options }
                );

                interaction.reply('Updated welcome message embed settings!')
                return;
            }

            if (
                !options.description ||
                !options.title
            ) {
                client.reply(interaction, 'There must be at least one description and title in the embed');
                return;
            }

            if (
                options.color &&
                !options.color.match(/^#[a-f0-9]{6}$/i)
            ) {
                client.reply(interaction, 'The color option must be of a proper color hex format');
                return;
            }

            await WelcomeMessage.create({
                'guildId': interaction.guildId,
                'isEnabled': true,
                ...options,
            });

            interaction.reply('Welcome message embed set-up is done!');
            return;
        };

        if (client.routing(interaction, 'message', 'channel')) {
            const options = client.sanitize({
                'channelId': interaction.options.getChannel('text_channel')?.id,
                'isEnabled': interaction.options.getBoolean('enabled')
            });

            if (!Object.keys(options).length) {
                client.reply(interaction, 'No options were provided');
                return;
            }

            const embed = await WelcomeMessage.findOne({ 'guildId': interaction.guildId });

            if (!embed) {
                client.reply(interaction, 'Welcome messages might be disabled or no welcome embed has been set');
                return;
            }

            await WelcomeMessage.findOneAndUpdate(
                { 'guildId': interaction.guildId },
                { '$set': options }
            );

            interaction.reply('Update welcome message channel settings!');
            return;
        };

        if (client.routing(interaction, 'role', 'set')) {
            const role = interaction.options.getRole('role');

            const _role = await WelcomeRole.findOne({
                'guildId': interaction.guildId,
                'roleId': role.id
            });

            if (_role) {
                client.reply(interaction, `Role ${inlineCode(role.name)} is already set as a welcome role`);
                return;
            }

            await WelcomeRole.create({
                'guildId': interaction.guildId,
                'roleId': role.id
            })

            interaction.reply(`Added role ${inlineCode(role.name)}`);
            return;
        }

        if (client.routing(interaction, 'role', 'unset')) {
            const role = interaction.options.getRole('role');

            await WelcomeRole.findOneAndDelete({
                'guildId': interaction.guildId,
                'roleId': role.id,
            })

            interaction.reply(`Removed role ${inlineCode(role.name)}`);
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
                ? `Here are the current welcome roles for newcomers: ${roles.join(', ')}`
                : `No roles found. Use ${inlineCode('/welcome roles add')} to add new welcome roles`;

            const embed = new EmbedBuilder()
                .setTitle('List of Welcome Roles')
                .setDescription(description);

            interaction.reply({ 'embeds': [embed] });
        }
    },
});
