# TMD Opti License Bot

Discord bot for generating and managing TMD Opti license keys.

## Setup

### 1. Create a Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Give it a name (e.g., "TMD Opti License Bot")
4. Go to the "Bot" section
5. Click "Add Bot"
6. Under "Token", click "Reset Token" and copy it
7. Go to "OAuth2" > "General" and copy your "Client ID"

### 2. Configure the Bot

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```
   DISCORD_TOKEN=your_bot_token_here
   CLIENT_ID=your_client_id_here
   ```

### 3. Invite the Bot to Your Server

1. Go to "OAuth2" > "URL Generator" in Discord Developer Portal
2. Select scopes:
   - `bot`
   - `applications.commands`
3. Select permissions:
   - Send Messages
   - Use Slash Commands
4. Copy the generated URL and open it in your browser
5. Select your server and authorize

### 4. Run the Bot

```bash
npm start
```

The bot will automatically register slash commands when it starts.

## Commands

### `/generate <email> [days]`
Generate a new license key for TMD Opti.

- `email` (required): Email address for the license
- `days` (optional): Number of days the license is valid (default: 365, max: 3650)

**Example:**
```
/generate email:user@example.com days:365
```

### `/verify <key>`
Verify if a license key is valid.

- `key` (required): The license key to verify

**Example:**
```
/verify key:ABCD-EFGH-IJKL-MNOP
```

### `/info`
Display information about TMD Opti and available commands.

## Features

- 🔑 Generate license keys via Discord
- ✅ Verify existing license keys
- 📧 Email-based licensing
- ⏰ Custom expiry dates
- 🔒 Encrypted license keys
- 👤 Private responses (only visible to command user)

## Security Notes

- All license generation responses are ephemeral (only visible to the user who ran the command)
- License keys are encrypted using AES encryption
- The secret key must match between the bot and the TMD Opti application
- In production, store generated licenses in a database instead of in-memory

## Troubleshooting

### Bot doesn't respond to commands
- Make sure the bot is online
- Check that you invited it with the correct permissions
- Verify your `.env` file has the correct token and client ID
- Wait a few minutes for Discord to register the slash commands

### "Invalid license key format" error
- Ensure the `SECRET_KEY` in `license.js` matches exactly with the main application
- Copy the entire license key without adding or removing characters

### Commands not showing up
- The bot needs time to register commands (can take up to an hour in some cases)
- Try kicking and re-inviting the bot
- Make sure you selected "applications.commands" scope when inviting

## License Key Format

License keys are generated as encrypted strings formatted with dashes for readability:
```
ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12-3456-7890
```

Each key contains:
- User's email
- Expiry date
- Generation timestamp

Keys are validated by the TMD Opti desktop application.
