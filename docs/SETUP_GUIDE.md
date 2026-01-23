# TMD Opti - Complete Setup Guide

## Overview

TMD Opti is a professional video optimizer with a minimalist design and Discord-based license key generation system.

## What's Been Updated

### 1. Fixed License Key System ✅
- Fixed encryption/decryption issues
- License keys now work correctly
- Keys are formatted with dashes for readability

### 2. Discord Bot for License Generation ✅
- Complete Discord bot application
- Slash commands for generating and verifying licenses
- Professional Discord embeds
- Private responses (only visible to command user)

### 3. Minimalist UI Redesign ✅
- New grey/black/white color scheme
- Clean, modern design
- Reduced visual clutter
- Sharp edges and minimal borders

### 4. Rebranded to TMD Opti ✅
- Changed from "TikTok Video Optimizer" to "TMD Opti"
- Updated all branding throughout the app
- More professional and versatile name

## Application Structure

```
tiktok-video-optimizer/
├── src/                          # Main application code
│   ├── main.js                   # Electron main process
│   ├── preload.js                # IPC bridge
│   ├── license.js                # License validation
│   └── videoProcessor.js         # FFmpeg video processing
├── public/                       # Frontend files
│   ├── index.html                # UI layout
│   ├── styles.css                # Minimalist styling
│   └── renderer.js               # UI logic
├── discord-bot/                  # Discord bot for licenses
│   ├── bot.js                    # Bot main file
│   ├── license.js                # License generation (same logic)
│   ├── .env.example              # Environment variables template
│   └── README.md                 # Bot setup instructions
├── package.json                  # Dependencies & scripts
└── README.md                     # Main documentation
```

## Running TMD Opti

### The Application is Already Running!

TMD Opti should be open on your screen right now with the new minimalist design.

If not, start it with:
```bash
cd /Users/khayel/tiktok-video-optimizer
npm start
```

### Using the Application

1. **First Time - Generate a License:**
   - Option A: Use the Discord bot (see Discord Bot Setup below)
   - Option B: Use the built-in demo generator:
     - Enter any email (e.g., "user@example.com")
     - Click "Generate Demo License"
     - Copy the generated key
     - Paste it above and click "Activate License"

2. **Add Videos:**
   - Drag & drop video files onto the drop zone
   - Or click "Browse Files"

3. **Select Quality Preset:**
   - **Standard**: 1080p, 4Mbps
   - **High Quality**: 1080p, 6Mbps (Recommended)
   - **4K**: 2160p, 15Mbps

4. **Process:**
   - Click "Browse" to select output directory
   - Click "Process Videos"
   - Monitor progress for each video
   - Find optimized videos with "_optimized.mp4" suffix

## Discord Bot Setup

The Discord bot allows you to generate license keys directly from Discord.

### Step 1: Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Name it "TMD Opti License Bot"
4. Go to "Bot" section → Click "Add Bot"
5. Under "Token" → Click "Reset Token" and copy it
6. Go to "OAuth2" → "General" → Copy your "Client ID"

### Step 2: Configure Bot

1. Navigate to the bot directory:
   ```bash
   cd /Users/khayel/tiktok-video-optimizer/discord-bot
   ```

2. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` with your credentials:
   ```env
   DISCORD_TOKEN=MTQ2Mzc0MTc4MjU5OTc5ODk3Ng.GLs2kD.qITkQxmSthFcfHEwtoacO16kC14MnF8B4ary3A
   CLIENT_ID=1463741782599798976
   ```

### Step 3: Invite Bot to Server

1. In Discord Developer Portal, go to "OAuth2" → "URL Generator"
2. Select scopes:
   - ✅ `bot`
   - ✅ `applications.commands`
3. Select permissions:
   - ✅ Send Messages
   - ✅ Use Slash Commands
4. Copy the generated URL and open in browser
5. Select your server and authorize

### Step 4: Run the Bot

```bash
cd /Users/khayel/tiktok-video-optimizer/discord-bot
npm start
```

The bot will start and register slash commands automatically.

### Discord Bot Commands

#### `/generate <email> [days]`
Generate a new license key.

**Example:**
```
/generate email:user@example.com days:365
```

**Response:** Private message with the license key

#### `/verify <key>`
Verify if a license key is valid.

**Example:**
```
/verify key:ABCD-EFGH-IJKL
```

**Response:** Shows validity status, expiry date, and days remaining

#### `/info`
Display information about TMD Opti.

## Design System

### Color Palette

- **Background Dark**: `#0a0a0a` - Main background
- **Background Light**: `#1a1a1a` - Cards and panels
- **Background Lighter**: `#252525` - Hover states
- **Text Primary**: `#ffffff` - Main text
- **Text Secondary**: `#808080` - Secondary text
- **Text Tertiary**: `#4a4a4a` - Disabled text
- **Border**: `#2a2a2a` - Main borders
- **Border Light**: `#353535` - Subtle borders

### Typography

- **Font**: System fonts (San Francisco on macOS)
- **Sizes**: 11px - 24px
- **Weights**: 400 (normal), 500 (medium)
- **Letter Spacing**: Tight (-0.02em to -0.01em)

### Layout

- **Border Radius**: 2px (minimal, sharp corners)
- **Spacing**: 8px, 12px, 16px, 24px, 32px
- **Buttons**: Uppercase, 13px, letter-spacing: 0.05em

## Technical Details

### Video Encoding

- **Codec**: H.264 (libx264)
- **Presets**: slow/veryslow for best compression
- **Profile**: High
- **Format**: MP4 with AAC audio
- **Aspect Ratio**: 9:16 (vertical) for social media

### License System

- **Encryption**: AES (crypto-js)
- **Secret Key**: `TMD_OPTI_2024_SECRET_KEY`
- **Format**: Encrypted string with dashes every 4 characters
- **Storage**: Local (userData directory)
- **Validation**: Both email and expiry date checked

### Supported Formats

**Input:** MP4, MOV, AVI, MKV, WebM, FLV
**Output:** MP4 (H.264 + AAC)

## Building Distributables

Create installable applications:

```bash
# macOS
npm run build:mac

# Windows
npm run build:win

# Linux
npm run build:linux
```

Output will be in the `dist/` folder.

## Troubleshooting

### License Key Issues

**Problem:** "Invalid license key format"
- Ensure you copied the entire key
- Check that SECRET_KEY matches in both app and Discord bot
- Try generating a new key

### Discord Bot Issues

**Problem:** Bot doesn't respond
- Verify bot is online
- Check `.env` credentials are correct
- Wait a few minutes for slash commands to register
- Try reinviting the bot

**Problem:** Commands not showing
- Can take up to 1 hour for Discord to register commands
- Make sure you invited with `applications.commands` scope
- Check bot has proper permissions

### Video Processing Issues

**Problem:** Videos won't process
- Verify output directory has write permissions
- Check input files are valid video files
- Ensure enough disk space
- FFmpeg is included via npm package

## File Locations

- **Application**: `/Users/khayel/tiktok-video-optimizer/`
- **Discord Bot**: `/Users/khayel/tiktok-video-optimizer/discord-bot/`
- **License Storage**: `~/Library/Application Support/tmd-opti/license.key` (macOS)

## Key Features

✅ Professional minimalist design
✅ Discord-based license generation
✅ Batch video processing
✅ Real-time progress tracking
✅ Multiple quality presets
✅ Drag & drop interface
✅ Cross-platform (macOS, Windows, Linux)

## Support

For issues or questions:
1. Check this guide
2. Review README.md files
3. Check discord-bot/README.md for bot-specific help
4. Verify all dependencies are installed

---

**TMD Opti** - Professional Video Optimizer
