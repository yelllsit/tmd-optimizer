# Discord Bot Setup - Complete Step-by-Step Guide

This guide will walk you through setting up the TMD Opti License Bot on Discord from scratch.

## What the Bot Does

The Discord bot allows you to:
- Generate license keys for TMD Opti with specific durations
- Verify existing license keys
- Manage licenses for multiple users
- All responses are private (only visible to the user who ran the command)

## Duration Options

The bot supports the following license durations:
- **1 Day** - Short-term testing
- **3 Days** - Extended testing
- **7 Days** - Weekly access
- **30 Days** - Monthly subscription
- **90 Days** - Quarterly subscription
- **360 Days** - Annual subscription

---

## Part 1: Create Discord Application

### Step 1: Go to Discord Developer Portal

1. Open your web browser
2. Go to: https://discord.com/developers/applications
3. Log in with your Discord account

### Step 2: Create New Application

1. Click the **"New Application"** button (top right)
2. Enter a name: `TMD Opti License Bot` (or any name you prefer)
3. Click **"Create"**

### Step 3: Configure Basic Information

1. You'll see your application's dashboard
2. (Optional) Add an **App Icon** - upload an image for your bot
3. (Optional) Add a **Description**: "License key generator for TMD Opti"
4. Click **"Save Changes"** at the bottom

### Step 4: Create the Bot

1. In the left sidebar, click **"Bot"**
2. Click **"Add Bot"** button
3. Click **"Yes, do it!"** to confirm
4. You now have a bot!

### Step 5: Get Your Bot Token

⚠️ **IMPORTANT: Keep this token secret! Don't share it with anyone!**

1. Under the bot's username, find the **"TOKEN"** section
2. Click **"Reset Token"**
3. Click **"Yes, do it!"** to confirm
4. Click **"Copy"** to copy your bot token
5. **Save this token somewhere safe** - you'll need it in a moment

### Step 6: Configure Bot Settings

1. Scroll down to **"Privileged Gateway Intents"**
2. You don't need to enable any of these for this bot
3. Leave them all disabled
4. Click **"Save Changes"**

### Step 7: Get Your Client ID

1. In the left sidebar, click **"OAuth2"** → **"General"**
2. Find **"CLIENT ID"** at the top
3. Click **"Copy"** to copy your Client ID
4. **Save this ID** - you'll need it too

---

## Part 2: Invite Bot to Your Server

### Step 8: Generate Invite Link

1. In the left sidebar, click **"OAuth2"** → **"URL Generator"**
2. Under **"SCOPES"**, check these boxes:
   - ✅ `bot`
   - ✅ `applications.commands`
3. Under **"BOT PERMISSIONS"**, check:
   - ✅ `Send Messages`
   - ✅ `Use Slash Commands`
4. Scroll down and click **"Copy"** next to the generated URL

### Step 9: Invite to Server

1. Open a new browser tab
2. Paste the copied URL
3. Select your Discord server from the dropdown
4. Click **"Authorize"**
5. Complete the captcha
6. Done! Your bot is now in your server (but offline until we run it)

---

## Part 3: Configure the Bot

### Step 10: Navigate to Bot Directory

Open Terminal (or Command Prompt on Windows) and run:

```bash
cd /Users/khayel/tiktok-video-optimizer/discord-bot
```

### Step 11: Create .env File

Copy the example environment file:

```bash
cp .env.example .env
```

### Step 12: Edit .env File

Open the `.env` file in a text editor:

```bash
open -e .env
```

Or use any text editor you prefer (VS Code, TextEdit, etc.)

**Replace the placeholder values with your actual credentials:**

```env
# Your Discord Bot Token (from Step 5)
DISCORD_TOKEN=paste_your_bot_token_here

# Your Discord Application Client ID (from Step 7)
CLIENT_ID=paste_your_client_id_here
```

**Example (with fake values):**
```env
DISCORD_TOKEN=MTIzNDU2Nzg5MDEyMzQ1Njc4OQ.GhJkLm.NoPqRsTuVwXyZ1234567890AbCdEfGhIjKlMnO
CLIENT_ID=1234567890123456789
```

**Save and close the file.**

---

## Part 4: Run the Bot

### Step 13: Install Dependencies

If you haven't already:

```bash
npm install
```

### Step 14: Start the Bot

```bash
npm start
```

You should see:
```
Started refreshing application (/) commands.
Successfully reloaded application (/) commands.
Logged in as TMD Opti License Bot#1234!
TMD Opti License Bot is ready!
```

### Step 15: Verify Bot is Online

1. Open Discord
2. Check your server
3. Your bot should show as **Online** (green dot)

---

## Part 5: Use the Bot

### Discord Commands

#### `/generate` - Generate a License Key

**Command:**
```
/generate email:user@example.com duration:30 Days
```

**Parameters:**
- `email`: Email address for the license (required)
- `duration`: Choose from:
  - 1 Day
  - 3 Days
  - 7 Days
  - 30 Days
  - 90 Days
  - 360 Days

**Response:**
You'll get a private message (only you can see it) with:
- Email address
- Duration
- License key (formatted with dashes)

**Example Response:**
```
✅ License Key Generated

Your TMD Opti license key has been generated successfully!

📧 Email: user@example.com
⏱️ Duration: 30 Days

🔑 License Key:
U2Fsd-GVkX-1234-5678-9abc-defg-hijk-lmno-pqrs
```

#### `/verify` - Verify a License Key

**Command:**
```
/verify key:U2Fsd-GVkX-1234-5678
```

**Parameters:**
- `key`: The license key to verify

**Response:**
Shows if the key is valid, expired, or invalid, along with:
- Email address
- Days remaining
- Expiry date

#### `/info` - Bot Information

**Command:**
```
/info
```

**Response:**
Displays information about TMD Opti and available commands.

---

## Troubleshooting

### Bot Shows as Offline

**Problem:** Bot appears offline in Discord

**Solution:**
1. Check that the bot is running (Terminal should show "Logged in as...")
2. Verify your `DISCORD_TOKEN` in `.env` is correct
3. Make sure you copied the entire token with no extra spaces
4. Try restarting the bot (Ctrl+C to stop, then `npm start` again)

### Commands Don't Show Up

**Problem:** Slash commands aren't appearing when you type `/`

**Solution:**
1. Wait 5-10 minutes - Discord can take time to register commands
2. Try leaving and rejoining the server
3. Check that you invited the bot with `applications.commands` scope
4. In some cases, it can take up to 1 hour for global commands to appear

### "Invalid Token" Error

**Problem:** Bot crashes with "Invalid token" error

**Solution:**
1. Go back to Discord Developer Portal
2. Go to Bot section
3. Click "Reset Token" and get a new token
4. Update your `.env` file with the new token
5. Restart the bot

### "Unknown Application" Error

**Problem:** Getting "Unknown application" error when registering commands

**Solution:**
1. Verify your `CLIENT_ID` in `.env` is correct
2. Make sure it's the Application ID, not the Bot ID
3. Check for extra spaces or line breaks in the `.env` file

### License Keys Don't Work in App

**Problem:** License keys generated by bot don't work in TMD Opti

**Solution:**
1. Verify the `SECRET_KEY` is the same in both:
   - `/discord-bot/license.js` → Line 4
   - `/src/license.js` → Line 4
2. Both should be: `TMD_OPTI_2024_SECRET_KEY`
3. If you changed one, update the other to match
4. Restart both the bot and the app

### Bot Crashes on Startup

**Problem:** Bot exits immediately after starting

**Solution:**
1. Check for syntax errors in `.env`:
   - No quotes around values
   - No extra spaces
   - No comments on the same line
2. Make sure `node_modules` is installed: `npm install`
3. Check Terminal output for specific error messages

---

## Running the Bot Permanently

### Option 1: Keep Terminal Open

**Pros:** Simple, works immediately
**Cons:** Bot stops when you close Terminal

Just keep the Terminal window open and running.

### Option 2: Using `screen` (macOS/Linux)

**Pros:** Bot keeps running even after closing Terminal
**Cons:** Requires learning basic screen commands

```bash
# Start a new screen session
screen -S tmd-bot

# Run the bot
cd /Users/khayel/tiktok-video-optimizer/discord-bot
npm start

# Detach from screen (bot keeps running)
# Press: Ctrl+A, then D

# To reattach later:
screen -r tmd-bot

# To stop the bot:
# Reattach, then press Ctrl+C
```

### Option 3: Using PM2

**Pros:** Auto-restart on crashes, easy management
**Cons:** Requires installing PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start the bot
cd /Users/khayel/tiktok-video-optimizer/discord-bot
pm2 start bot.js --name tmd-bot

# Check status
pm2 status

# View logs
pm2 logs tmd-bot

# Stop the bot
pm2 stop tmd-bot

# Start on system boot
pm2 startup
pm2 save
```

### Option 4: Cloud Hosting

**Pros:** Bot runs 24/7, professional setup
**Cons:** May cost money

Popular options:
- **Heroku** - Free tier available
- **Railway** - Free tier available
- **DigitalOcean** - $4-5/month
- **AWS** - Free tier for 12 months

---

## Security Best Practices

### ✅ Do's:

- ✅ Keep your `.env` file secure
- ✅ Never commit `.env` to git
- ✅ Use different tokens for testing and production
- ✅ Regularly check who has access to your bot
- ✅ Monitor generated licenses

### ❌ Don'ts:

- ❌ Never share your bot token publicly
- ❌ Don't post screenshots showing your token
- ❌ Don't commit tokens to GitHub/GitLab
- ❌ Don't give bot admin permissions (not needed)
- ❌ Don't use the demo license generator in production

---

## Next Steps

1. ✅ Bot is running and responding to commands
2. Generate a license key using `/generate`
3. Copy the license key
4. Open TMD Opti application
5. Paste and activate the license
6. Start optimizing videos!

---

## Need Help?

If you're still having issues:

1. Check the Terminal output for error messages
2. Verify all credentials in `.env` are correct
3. Make sure bot has proper permissions in Discord
4. Check Discord server settings → Integrations → Make sure bot is enabled
5. Try regenerating your bot token and updating `.env`

---

## Summary

**You've learned how to:**
- ✅ Create a Discord application and bot
- ✅ Configure bot permissions and settings
- ✅ Invite the bot to your server
- ✅ Set up environment variables
- ✅ Run the bot and use slash commands
- ✅ Generate license keys with custom durations
- ✅ Troubleshoot common issues

Your Discord bot is now ready to generate license keys for TMD Opti! 🎉
