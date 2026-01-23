# TMD Opti - Application Distribution Guide

Complete guide for building and sharing your TMD Opti application with others.

---

## Table of Contents

1. [Building Distributable Apps](#part-1-building-distributable-apps)
2. [Testing Your Build](#part-2-testing-your-build)
3. [Sharing Methods](#part-3-sharing-methods)
4. [Setting Up a Website](#part-4-setting-up-a-website-optional)
5. [Creating Update System](#part-5-creating-update-system-optional)
6. [Legal & Licensing](#part-6-legal--licensing)

---

## Part 1: Building Distributable Apps

### For macOS (What You Have Now)

#### Build DMG Installer

```bash
cd /Users/khayel/tiktok-video-optimizer
npm run build:mac
```

This creates:
- `dist/TMD Opti-1.0.0.dmg` - Installer (recommended for distribution)
- `dist/TMD Opti-1.0.0-mac.zip` - Portable version

**What you get:**
- ✅ Double-clickable `.dmg` file
- ✅ Drag-to-install experience
- ✅ Code-signed (if you have Apple Developer account)
- ✅ Works on macOS 10.13+

#### File Locations:

After building, find your files here:
```
/Users/khayel/tiktok-video-optimizer/dist/
├── TMD Opti-1.0.0.dmg          (~100-150 MB)
├── TMD Opti-1.0.0-mac.zip      (~100-150 MB)
└── mac/                         (build files, can be deleted)
```

### For Windows (Cross-Platform Build)

#### Option 1: Build on macOS (Limited)

```bash
npm run build:win
```

**Note:** This creates a Windows installer but it won't be signed. Users may see security warnings.

#### Option 2: Build on Windows (Recommended)

If you have access to a Windows machine:

1. Copy your project folder to Windows
2. Install Node.js on Windows
3. Run:
```cmd
cd tiktok-video-optimizer
npm install
npm run build:win
```

This creates:
- `dist/TMD Opti Setup 1.0.0.exe` - Installer
- `dist/TMD Opti 1.0.0.exe` - Portable version

### For Linux

```bash
npm run build:linux
```

This creates:
- `dist/TMD Opti-1.0.0.AppImage` - Universal Linux installer
- `dist/tmd-opti_1.0.0_amd64.deb` - Debian/Ubuntu package

---

## Part 2: Testing Your Build

### Test macOS DMG

1. **Build the app:**
   ```bash
   npm run build:mac
   ```

2. **Open the DMG:**
   ```bash
   open dist/TMD\ Opti-1.0.0.dmg
   ```

3. **Install:**
   - Drag "TMD Opti" to Applications folder
   - Open from Applications

4. **Test all features:**
   - ✅ License activation works
   - ✅ Can drag and drop videos
   - ✅ Video processing works
   - ✅ Files save correctly
   - ✅ No errors in Console (open with Cmd+Option+I in dev mode)

### Common Build Issues

#### "Could not find module"

**Problem:** Missing dependencies

**Solution:**
```bash
npm install
npm run build:mac
```

#### "Permission denied"

**Problem:** Can't write to dist folder

**Solution:**
```bash
chmod -R 755 dist/
npm run build:mac
```

#### Build takes forever

**Problem:** First build includes downloading Electron binaries

**Solution:** Wait it out (15-30 minutes first time), subsequent builds are faster

---

## Part 3: Sharing Methods

### Method 1: Direct File Sharing (Easiest)

**Best for:** Sharing with a few people

1. **Build the app:**
   ```bash
   npm run build:mac
   ```

2. **Upload to cloud storage:**
   - Google Drive
   - Dropbox
   - iCloud Drive
   - OneDrive

3. **Share the link:**
   - Get shareable link
   - Send to users
   - Users download and install

**Pros:**
- ✅ Free
- ✅ Simple
- ✅ Works immediately

**Cons:**
- ❌ No automatic updates
- ❌ Limited bandwidth on free plans
- ❌ Need to reshare for updates

### Method 2: GitHub Releases (Recommended)

**Best for:** Public distribution, version control

#### Step-by-Step:

1. **Create GitHub Repository:**
   ```bash
   cd /Users/khayel/tiktok-video-optimizer

   # Initialize git (if not already)
   git init

   # Create .gitignore
   echo "node_modules/
   dist/
   .env
   *.log
   .DS_Store" > .gitignore

   # Commit code
   git add .
   git commit -m "Initial commit"

   # Create GitHub repo and push
   # (Follow GitHub instructions)
   ```

2. **Build your app:**
   ```bash
   npm run build:mac
   ```

3. **Create a Release on GitHub:**
   - Go to your GitHub repository
   - Click "Releases" → "Create a new release"
   - Tag version: `v1.0.0`
   - Release title: `TMD Opti v1.0.0`
   - Description: List features and changes
   - Attach files:
     - `TMD Opti-1.0.0.dmg`
     - `TMD Opti-1.0.0-mac.zip`
   - Click "Publish release"

4. **Share the release link:**
   ```
   https://github.com/yourusername/tmd-opti/releases/latest
   ```

**Pros:**
- ✅ Free hosting
- ✅ Unlimited bandwidth
- ✅ Version history
- ✅ Professional look
- ✅ Users get notified of updates (if they follow repo)

**Cons:**
- ❌ Requires GitHub account
- ❌ Code is public (unless you pay for private repos)

### Method 3: Self-Hosted Website

**Best for:** Professional distribution, custom domain

See [Part 4](#part-4-setting-up-a-website-optional) below.

### Method 4: Mac App Store (Advanced)

**Best for:** Maximum distribution, professional

**Requirements:**
- Apple Developer Account ($99/year)
- Code signing
- App Store approval process

**Not recommended for beginners - very complex process**

---

## Part 4: Setting Up a Website (Optional)

### Option A: Simple Static Site (Free)

#### Using GitHub Pages:

1. **Create `docs/` folder in your project:**
   ```bash
   mkdir docs
   ```

2. **Create `docs/index.html`:**
   ```html
   <!DOCTYPE html>
   <html>
   <head>
       <title>TMD Opti - Video Optimizer</title>
       <style>
           body {
               font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
               max-width: 800px;
               margin: 50px auto;
               padding: 20px;
               background: #0a0a0a;
               color: #ffffff;
           }
           .download-btn {
               background: #ffffff;
               color: #0a0a0a;
               padding: 15px 30px;
               text-decoration: none;
               border-radius: 5px;
               display: inline-block;
               margin: 10px;
           }
           .download-btn:hover {
               background: #e8e8e8;
           }
       </style>
   </head>
   <body>
       <h1>TMD Opti</h1>
       <p>Professional Video Optimizer</p>

       <h2>Download</h2>
       <a href="https://github.com/yourusername/tmd-opti/releases/latest" class="download-btn">
           Download for macOS
       </a>

       <h2>Features</h2>
       <ul>
           <li>Optimize videos for social media</li>
           <li>Multiple quality presets</li>
           <li>Batch processing</li>
           <li>Real-time progress tracking</li>
       </ul>

       <h2>Requirements</h2>
       <ul>
           <li>macOS 10.13 or later</li>
           <li>License key (get from Discord)</li>
       </ul>
   </body>
   </html>
   ```

3. **Enable GitHub Pages:**
   - Go to repository Settings
   - Scroll to "Pages"
   - Source: Deploy from a branch
   - Branch: main, folder: /docs
   - Save

4. **Your site will be at:**
   ```
   https://yourusername.github.io/tmd-opti/
   ```

### Option B: Custom Domain

**Services:**
- **Netlify** (Free tier available)
- **Vercel** (Free tier available)
- **Cloudflare Pages** (Free)

**Steps:**
1. Sign up for service
2. Connect GitHub repository
3. Deploy `docs/` folder
4. Add custom domain (optional)

---

## Part 5: Creating Update System (Optional)

### Using electron-updater

1. **Install electron-updater:**
   ```bash
   npm install electron-updater
   ```

2. **Update `src/main.js`:**
   ```javascript
   const { autoUpdater } = require('electron-updater');

   app.whenReady().then(() => {
       createWindow();

       // Check for updates
       autoUpdater.checkForUpdatesAndNotify();
   });
   ```

3. **Configure in `package.json`:**
   ```json
   "build": {
       "publish": [{
           "provider": "github",
           "owner": "yourusername",
           "repo": "tmd-opti"
       }]
   }
   ```

4. **Users will get automatic update notifications**

---

## Part 6: Legal & Licensing

### License Key System

**Your current setup:**
- ✅ License key system is already implemented
- ✅ Discord bot generates keys
- ✅ Keys have expiry dates
- ✅ Durations: 1d, 3d, 7d, 30d, 90d, 360d

**Recommended approach:**

1. **For Free Distribution:**
   - Keep demo license generator in app
   - Or provide keys for free via Discord bot
   - Focus on building user base

2. **For Paid Distribution:**
   - Remove demo license generator from app
   - Run Discord bot on private server
   - Only give bot access to paying customers
   - Consider integration with payment processors:
     - Stripe
     - PayPal
     - Gumroad
     - Paddle

### Software License

Add a `LICENSE` file to your project:

**MIT License (Permissive):**
```
MIT License

Copyright (c) 2024 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy...
```

**Or use a more restrictive license if you want to sell the software.**

### Terms of Service

Create a `TERMS.md`:

```markdown
# Terms of Service

## License Key
- Keys are non-transferable
- One license per user
- Expiry dates are enforced

## Usage
- For personal or commercial use
- No redistribution of license keys
- No reverse engineering

## Support
- Support provided via Discord
- No guaranteed response time
- Updates provided as available
```

---

## Distribution Checklist

### Before Sharing:

- [ ] App builds successfully
- [ ] All features tested
- [ ] License system works
- [ ] Discord bot is running
- [ ] Created README with instructions
- [ ] Tested on clean macOS install (if possible)
- [ ] Created installer (DMG)
- [ ] Decided on distribution method
- [ ] Set up update mechanism (optional)
- [ ] Created website or landing page (optional)

### Files to Share:

**Minimum:**
- [ ] `TMD Opti-1.0.0.dmg` (macOS installer)
- [ ] `README.md` (usage instructions)
- [ ] Discord server link (for license keys)

**Recommended:**
- [ ] `CHANGELOG.md` (version history)
- [ ] `LICENSE` (software license)
- [ ] Screenshots or demo video
- [ ] System requirements list

**Do NOT share:**
- ❌ `.env` file (contains bot tokens)
- ❌ `node_modules/` folder
- ❌ Source code (unless open source)
- ❌ Bot tokens or API keys

---

## Sharing Workflow Example

### Complete Distribution Process:

1. **Prepare Release:**
   ```bash
   # Update version in package.json
   # Update CHANGELOG.md
   git add .
   git commit -m "Release v1.0.0"
   git push
   ```

2. **Build App:**
   ```bash
   npm run build:mac
   ```

3. **Test Build:**
   - Install DMG
   - Test all features
   - Generate license
   - Process a video

4. **Upload to GitHub:**
   - Create release v1.0.0
   - Upload `TMD Opti-1.0.0.dmg`
   - Write release notes

5. **Announce:**
   - Share release link
   - Post on Discord
   - Share on social media
   - Send to beta testers

---

## Pricing Models (If Selling)

### Option 1: One-Time Purchase
- User buys once, gets perpetual license
- Example: $29.99 one-time

### Option 2: Subscription
- Monthly or yearly recurring
- Example: $4.99/month or $49.99/year
- Use different duration keys per plan

### Option 3: Freemium
- Free version with limited features
- Premium for full features
- Use license to unlock premium

### Option 4: Pay What You Want
- Users choose their price
- Good for building audience
- Still requires license key

---

## Platform-Specific Notes

### macOS Distribution

**Without Code Signing:**
- Users see "App from unidentified developer"
- Users must right-click → Open first time
- Security warning appears

**With Code Signing ($99/year):**
- No warnings
- Smoother installation
- Required for Mac App Store
- Builds trust

**To get code signing:**
1. Join Apple Developer Program ($99/year)
2. Create signing certificate
3. Update `package.json` with signing identity
4. Rebuild with signing enabled

### Windows Distribution

**Challenges:**
- Users see "Windows protected your PC" warning
- Need code signing certificate for clean install
- Certificate costs $100-400/year

**Without certificate:**
- Users can click "More info" → "Run anyway"
- Still works, just scary-looking

### Linux Distribution

**Easy distribution:**
- No signing required
- AppImage runs anywhere
- .deb for Debian/Ubuntu
- Users generally tech-savvy

---

## Support & Maintenance

### Update Strategy

**How often to update:**
- Bug fixes: As needed (1-7 days)
- New features: Monthly or quarterly
- Security patches: Immediately

**Version numbering:**
- Major.Minor.Patch (e.g., 1.0.0)
- Major: Breaking changes
- Minor: New features
- Patch: Bug fixes

### Support Channels

**Recommended:**
- Discord server for community support
- GitHub Issues for bug reports
- Email for private inquiries

**Create a Discord server:**
1. Create server for "TMD Opti"
2. Channels:
   - #announcements (updates)
   - #support (help requests)
   - #license-requests (bot is here)
   - #feedback (suggestions)

---

## Marketing Your App

### Places to Share

1. **Reddit:**
   - r/SideProject
   - r/VideoEditing
   - r/productivity

2. **Product Hunt:**
   - Launch your app
   - Get feedback
   - Build audience

3. **Twitter/X:**
   - Share development progress
   - Post feature demos
   - Engage with video creators

4. **YouTube:**
   - Tutorial videos
   - Feature demos
   - Comparisons

---

## Summary

You now know how to:

✅ Build distributable applications (.dmg, .exe, .AppImage)
✅ Test your builds
✅ Share via multiple methods (direct, GitHub, website)
✅ Set up automatic updates
✅ Handle licensing and legal
✅ Support multiple platforms
✅ Market and distribute your app

**Quick Start Distribution:**
1. Build: `npm run build:mac`
2. Test: Install the DMG and verify everything works
3. Share: Upload to Google Drive or GitHub Releases
4. Announce: Share the download link with users
5. Support: Help users via Discord

Your app is ready to share with the world! 🚀
