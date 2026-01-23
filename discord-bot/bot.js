require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, REST, Routes } = require('discord.js');
const { generateLicense } = require('./license');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ]
});

// Store generated licenses by user ID (in production, use a database)
// Structure: Map<userId, Array<{licenseKey, email, days, generatedAt}>>
const userLicenses = new Map();

// Define slash commands
const commands = [
  new SlashCommandBuilder()
    .setName('generate')
    .setDescription('Generate a TMD Opti license key')
    .addStringOption(option =>
      option.setName('email')
        .setDescription('Your email address')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('duration')
        .setDescription('License duration')
        .setRequired(true)
        .addChoices(
          { name: '1 Day', value: '1' },
          { name: '3 Days', value: '3' },
          { name: '7 Days', value: '7' },
          { name: '30 Days', value: '30' },
          { name: '90 Days', value: '90' },
          { name: '360 Days', value: '360' }
        )
    ),

  new SlashCommandBuilder()
    .setName('mylicenses')
    .setDescription('Show your generated license keys'),

  new SlashCommandBuilder()
    .setName('info')
    .setDescription('Get information about TMD Opti'),

  new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Verify a license key')
    .addStringOption(option =>
      option.setName('key')
        .setDescription('The license key to verify')
        .setRequired(true)
    )
].map(command => command.toJSON());

// Register slash commands
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

async function registerCommands() {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}

// Bot ready event
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log('TMD Opti License Bot is ready!');
  client.user.setActivity('TMD Opti | /generate', { type: 'WATCHING' });
});

// Handle interactions
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  // /generate command
  if (commandName === 'generate') {
    await interaction.deferReply({ ephemeral: true });

    // Check if user has Administrator permission
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.editReply({
        content: '❌ You need Administrator permission to generate license keys.',
        ephemeral: true
      });
    }

    const email = interaction.options.getString('email');
    const durationStr = interaction.options.getString('duration');
    const days = parseInt(durationStr);

    // Validate email
    if (!email.includes('@') || !email.includes('.')) {
      return interaction.editReply({
        content: '❌ Please provide a valid email address.',
        ephemeral: true
      });
    }

    try {
      // Generate license
      const licenseKey = generateLicense(email, days);

      // Store license info by user ID
      const userId = interaction.user.id;
      if (!userLicenses.has(userId)) {
        userLicenses.set(userId, []);
      }
      userLicenses.get(userId).push({
        licenseKey,
        email,
        days,
        generatedAt: new Date().toISOString(),
        userTag: interaction.user.tag
      });

      // Format duration text
      let durationText = '';
      if (days === 1) durationText = '1 Day';
      else if (days === 3) durationText = '3 Days';
      else if (days === 7) durationText = '7 Days';
      else if (days === 30) durationText = '30 Days';
      else if (days === 90) durationText = '90 Days';
      else if (days === 360) durationText = '360 Days';
      else durationText = `${days} days`;

      // Create embed
      const embed = new EmbedBuilder()
        .setColor(0xFFFFFF)
        .setTitle('✅ License Key Generated')
        .setDescription('Your TMD Opti license key has been generated successfully!')
        .addFields(
          { name: '📧 Email', value: email, inline: true },
          { name: '⏱️ Duration', value: durationText, inline: true },
          { name: '\u200B', value: '\u200B' },
          { name: '🔑 License Key', value: `\`\`\`${licenseKey}\`\`\`` }
        )
        .setFooter({ text: 'TMD Opti - Video Optimizer' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed], ephemeral: true });

      // Log to console
      console.log(`License generated for ${email} (${durationText}) by ${interaction.user.tag}`);

    } catch (error) {
      console.error('Error generating license:', error);
      await interaction.editReply({
        content: '❌ An error occurred while generating the license key.',
        ephemeral: true
      });
    }
  }

  // /mylicenses command
  else if (commandName === 'mylicenses') {
    await interaction.deferReply({ ephemeral: true });

    const userId = interaction.user.id;
    const licenses = userLicenses.get(userId);

    if (!licenses || licenses.length === 0) {
      return interaction.editReply({
        content: '❌ You haven\'t generated any license keys yet. Use `/generate` to create one!',
        ephemeral: true
      });
    }

    // Create embed showing all licenses
    const embed = new EmbedBuilder()
      .setColor(0xFFFFFF)
      .setTitle('🔑 Your License Keys')
      .setDescription(`You have ${licenses.length} license key(s)`)
      .setFooter({ text: 'TMD Opti - Video Optimizer' })
      .setTimestamp();

    // Add each license as a field
    licenses.forEach((license, index) => {
      const { validateLicense } = require('./license');
      const validation = validateLicense(license.licenseKey);

      let statusEmoji = '✅';
      let statusText = 'Active';
      if (!validation.valid) {
        statusEmoji = validation.message.includes('expired') ? '⏰' : '❌';
        statusText = validation.message.includes('expired') ? 'Expired' : 'Invalid';
      }

      const generatedDate = new Date(license.generatedAt).toLocaleDateString();

      embed.addFields({
        name: `${statusEmoji} License #${index + 1} - ${statusText}`,
        value: `**Email:** ${license.email}\n**Duration:** ${license.days} day(s)\n**Generated:** ${generatedDate}\n**Key:**\n\`\`\`${license.licenseKey}\`\`\``,
        inline: false
      });
    });

    await interaction.editReply({ embeds: [embed], ephemeral: true });
  }

  // /info command
  else if (commandName === 'info') {
    const embed = new EmbedBuilder()
      .setColor(0xFFFFFF)
      .setTitle('TMD Opti - Video Optimizer')
      .setDescription('Professional video optimization tool for content creators.')
      .addFields(
        { name: '📹 What is TMD Opti?', value: 'A desktop application that optimizes videos for social media platforms, ensuring maximum quality retention through compression.' },
        { name: '✨ Features', value: '• Multiple quality presets (1080p, 4K)\n• Batch processing\n• Real-time progress tracking\n• Professional encoding settings' },
        { name: '⏱️ License Durations', value: '1 Day • 3 Days • 7 Days • 30 Days • 90 Days • 360 Days' },
        { name: '🔑 Getting Started', value: 'Use `/generate` to create a license key for the application.' },
        { name: '💡 Commands', value: '`/generate` - Generate a license key\n`/mylicenses` - Show your license keys\n`/verify` - Verify an existing key\n`/info` - Show this information' }
      )
      .setFooter({ text: 'TMD Opti' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }

  // /verify command
  else if (commandName === 'verify') {
    await interaction.deferReply({ ephemeral: true });

    const licenseKey = interaction.options.getString('key');
    const { validateLicense } = require('./license');

    try {
      const result = validateLicense(licenseKey);

      if (result.valid) {
        const embed = new EmbedBuilder()
          .setColor(0x00FF00)
          .setTitle('✅ Valid License')
          .setDescription('This license key is valid and active.')
          .addFields(
            { name: '📧 Email', value: result.email, inline: true },
            { name: '📅 Days Remaining', value: `${result.daysRemaining} days`, inline: true },
            { name: '⏰ Expires', value: new Date(result.expiry).toLocaleDateString(), inline: true }
          )
          .setFooter({ text: 'TMD Opti' })
          .setTimestamp();

        await interaction.editReply({ embeds: [embed], ephemeral: true });
      } else {
        const embed = new EmbedBuilder()
          .setColor(0xFF0000)
          .setTitle('❌ Invalid License')
          .setDescription(result.message)
          .setFooter({ text: 'TMD Opti' })
          .setTimestamp();

        await interaction.editReply({ embeds: [embed], ephemeral: true });
      }
    } catch (error) {
      console.error('Error verifying license:', error);
      await interaction.editReply({
        content: '❌ An error occurred while verifying the license key.',
        ephemeral: true
      });
    }
  }
});

// Error handling
client.on('error', error => {
  console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

// Login and register commands
async function start() {
  await registerCommands();
  await client.login(process.env.DISCORD_TOKEN);
}

start();
