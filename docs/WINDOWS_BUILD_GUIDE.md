# Windows Build Guide - Complete Step-by-Step

This guide will help you build a Windows installer for TMD Opti from your macOS machine.

---

## ⚠️ Important Prerequisites

### Option 1: Build on Windows (Recommended - No Errors)

The most reliable way to build for Windows is **on a Windows machine**.

**Why?**
- Native Windows builds are signed properly
- No cross-compilation issues
- Faster build times
- No platform-specific errors

### Option 2: Cross-Compile from macOS (Can Have Issues)

You CAN build from macOS, but you may encounter:
- ✅ Builds successfully BUT
- ⚠️ Users see "Windows protected your PC" warning
- ⚠️ No code signing (requires Windows certificate)
- ⚠️ Slower build times

---

## Method 1: Build on Windows Machine (RECOMMENDED)

### What You Need:

- Windows 10 or 11
- Administrator access
- Internet connection

### Step 1: Install Node.js on Windows

1. **Download Node.js:**
   - Go to: https://nodejs.org
   - Download **LTS version** (e.g., 20.x.x)
   - Choose "Windows Installer (.msi)" - 64-bit

2. **Run the installer:**
   - Double-click the downloaded `.msi` file
   - Click "Next" through the wizard
   - ✅ Check "Automatically install necessary tools"
   - Click "Install"
   - Wait for completion
   - Click "Finish"

3. **Verify installation:**
   - Open **Command Prompt** (Win + R, type `cmd`, press Enter)
   - Run:
     ```cmd
     node --version
     npm --version
     ```
   - Should show versions like `v20.11.0` and `10.2.4`

### Step 2: Transfer Project to Windows

**Option A: Using USB Drive**

1. On macOS, copy entire project folder to USB drive:
   ```bash
   cp -r /Users/khayel/tiktok-video-optimizer /Volumes/YOUR_USB/
   ```

2. On Windows, copy from USB to your Documents:
   - Open File Explorer
   - Navigate to USB drive
   - Copy `tiktok-video-optimizer` folder
   - Paste into `C:\Users\YourName\Documents\`

**Option B: Using Cloud (Google Drive, Dropbox, OneDrive)**

1. On macOS:
   - Upload project folder to your cloud service
   - Wait for upload to complete

2. On Windows:
   - Download folder from cloud
   - Extract to `C:\Users\YourName\Documents\`

**Option C: Using Git (If you have GitHub)**

1. On macOS:
   ```bash
   cd /Users/khayel/tiktok-video-optimizer
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. On Windows:
   - Install Git: https://git-scm.com/download/win
   - Open Command Prompt
   ```cmd
   cd C:\Users\YourName\Documents
   git clone YOUR_GITHUB_REPO_URL
   cd tiktok-video-optimizer
   ```

### Step 3: Install Dependencies on Windows

1. **Open Command Prompt as Administrator:**
   - Press Win + X
   - Click "Command Prompt (Admin)" or "Windows Terminal (Admin)"

2. **Navigate to project folder:**
   ```cmd
   cd C:\Users\YourName\Documents\tiktok-video-optimizer
   ```

3. **Install dependencies:**
   ```cmd
   npm install
   ```
   - This will take 5-10 minutes
   - Downloads all packages needed

4. **Verify no errors:**
   - Should see "added XXX packages"
   - Warnings are OK, errors are not

### Step 4: Build Windows Installer

1. **Run the build command:**
   ```cmd
   npm run build:win
   ```

2. **Wait for build to complete:**
   - First build: 15-30 minutes
   - Downloads electron binaries (~150MB)
   - Compiles application
   - Creates installer

3. **Watch for completion:**
   ```
   • electron-builder  version=XX.X.X
   • loaded configuration  file=package.json
   • building          target=nsis-web
   • packing files
   • building installer
   ```

### Step 5: Find Your Installer

1. **Navigate to dist folder:**
   ```cmd
   cd dist
   dir
   ```

2. **You should see:**
   ```
   TMD Opti Setup 1.0.0.exe     (~150-200 MB)
   TMD Opti 1.0.0.exe           (~150-200 MB) - Portable version
   ```

3. **Copy to safe location:**
   ```cmd
   copy "TMD Opti Setup 1.0.0.exe" C:\Users\YourName\Desktop\
   ```

### Step 6: Test the Installer

1. **Close any running instances of TMD Opti**

2. **Double-click the installer:**
   - You may see "Windows protected your PC"
   - Click "More info"
   - Click "Run anyway"

3. **Follow installation wizard:**
   - Choose install location
   - Click "Install"
   - Wait for completion

4. **Launch TMD Opti:**
   - Should appear in Start Menu
   - Double-click to open
   - Test all features

### Step 7: Distribution

Now you can share `TMD Opti Setup 1.0.0.exe` with users!

**Upload to:**
- Google Drive
- Dropbox
- GitHub Releases
- Your website

---

## Method 2: Cross-Compile from macOS (Alternative)

⚠️ **This may show warnings to users but works!**

### Step 1: Install Wine (For Windows builds from macOS)

Wine allows you to build Windows apps on macOS.

1. **Install Homebrew (if not installed):**
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install Wine:**
   ```bash
   brew install --cask wine-stable
   ```
   - Takes 10-15 minutes
   - Downloads ~500MB

3. **Verify Wine installation:**
   ```bash
   wine --version
   ```
   - Should show something like `wine-9.0`

### Step 2: Build from macOS

1. **Navigate to project:**
   ```bash
   cd /Users/khayel/tiktok-video-optimizer
   ```

2. **Clean previous builds:**
   ```bash
   rm -rf dist/
   rm -rf node_modules/.cache
   ```

3. **Build for Windows:**
   ```bash
   npm run build:win
   ```

4. **Wait for completion:**
   - First build: 20-40 minutes
   - Downloads Windows electron binaries
   - Uses Wine to compile

5. **Find your installer:**
   ```bash
   ls -lh dist/
   ```
   - Should see `TMD Opti Setup 1.0.0.exe`

### Step 3: Test on Windows

**You MUST test on an actual Windows machine!**

1. Transfer `.exe` to Windows (USB, cloud, etc.)
2. Run the installer
3. Expect to see "Windows protected your PC"
   - Click "More info" → "Run anyway"
4. Test all features

---

## Common Build Errors & Solutions

### Error: "Cannot find module 'electron'"

**Problem:** Dependencies not installed

**Solution:**
```bash
rm -rf node_modules
npm install
npm run build:win
```

### Error: "ENOENT: no such file or directory"

**Problem:** Wrong directory or missing files

**Solution:**
```bash
# Make sure you're in the right folder
pwd
# Should show: /Users/khayel/tiktok-video-optimizer

# Check package.json exists
ls package.json
```

### Error: "wine: command not found" (macOS)

**Problem:** Wine not installed (needed for cross-compilation)

**Solution:**
```bash
brew install --cask wine-stable
```

### Error: "gyp ERR! build error"

**Problem:** Native modules compilation issue

**Solution:**
```bash
# Clear cache
npm cache clean --force
rm -rf node_modules
npm install

# Try build again
npm run build:win
```

### Error: "electron-builder  exit code=1"

**Problem:** Build configuration issue

**Solution:**
1. Check `package.json` for typos in `build` section
2. Make sure all files exist
3. Try:
   ```bash
   npm run build:win -- --dir
   ```
   This builds unpacked app (faster, for testing)

### Error: Out of Disk Space

**Problem:** Not enough space for build

**Solution:**
- Need at least 3GB free space
- Clear old builds: `rm -rf dist/`
- Delete `node_modules/.cache`

---

## Building Both macOS and Windows

If you want to build for BOTH platforms:

### From macOS:

```bash
# Build macOS
npm run build:mac

# Build Windows (requires Wine)
npm run build:win

# Or build both at once
npm run build
```

Outputs:
```
dist/
├── TMD Opti-1.0.0.dmg           (macOS installer)
├── TMD Opti-1.0.0-mac.zip       (macOS portable)
├── TMD Opti Setup 1.0.0.exe     (Windows installer)
└── TMD Opti 1.0.0.exe           (Windows portable)
```

---

## Code Signing (Optional but Recommended)

### For Windows:

**Without Code Signing:**
- ❌ Users see "Windows protected your PC"
- ❌ Windows Defender might flag it
- ✅ Still works, just looks unprofessional

**With Code Signing:**
- ✅ No warnings
- ✅ Trusted by Windows
- ✅ Professional appearance
- 💰 Costs $100-400/year

**How to get code signing certificate:**
1. Purchase from:
   - DigiCert (most trusted)
   - Sectigo
   - SSL.com
2. Follow their verification process (2-7 days)
3. Install certificate on Windows machine
4. Update `package.json`:
   ```json
   "win": {
     "certificateFile": "path/to/cert.pfx",
     "certificatePassword": "your-password"
   }
   ```

---

## Detailed Build Configuration

Your current `package.json` has this build config:

```json
"build": {
  "appId": "com.tmdopti.app",
  "productName": "TMD Opti",
  "win": {
    "target": [
      "nsis",
      "portable"
    ],
    "icon": "build/icon.ico"
  }
}
```

**What this means:**
- `nsis`: Creates installer with wizard
- `portable`: Creates standalone `.exe` (no install needed)
- `icon`: App icon (need to create this!)

### Creating App Icons

1. **Create icon images:**
   - 1024×1024 PNG for macOS
   - 256×256 ICO for Windows

2. **Place icons:**
   ```
   build/
   ├── icon.icns   (macOS)
   └── icon.ico    (Windows)
   ```

3. **Or use online converters:**
   - https://icon-icons.com/icon/converter
   - https://convertico.com

---

## Quick Reference Commands

```bash
# Install dependencies
npm install

# Build for Windows
npm run build:win

# Build for macOS
npm run build:mac

# Build for Linux
npm run build:linux

# Build for all platforms
npm run build

# Clean build
rm -rf dist/ node_modules/.cache/
npm run build:win

# Test without building installer (faster)
npm run build:win -- --dir
```

---

## Recommended Workflow

### For Personal Use (Quick):

```bash
cd /Users/khayel/tiktok-video-optimizer
npm run build:mac
open dist/
# Double-click TMD Opti.dmg
```

### For Distribution (Proper):

1. **On macOS:** Build for macOS
   ```bash
   npm run build:mac
   ```

2. **On Windows:** Build for Windows
   - Transfer project to Windows
   - Install Node.js
   - Run `npm install`
   - Run `npm run build:win`

3. **Upload both** to your hosting

4. **Test both** before sharing

---

## File Sizes Reference

**Expect these approximate sizes:**

- macOS DMG: ~100-150 MB
- macOS ZIP: ~100-150 MB
- Windows Installer: ~150-200 MB
- Windows Portable: ~150-200 MB

**Why so large?**
- Includes entire Electron runtime
- Includes Node.js
- Includes ffmpeg
- Includes your app code

This is normal for Electron apps!

---

## Troubleshooting Checklist

Before building, verify:

- [ ] Node.js installed (`node --version`)
- [ ] Dependencies installed (`ls node_modules/electron`)
- [ ] In correct directory (`pwd` shows project folder)
- [ ] package.json exists and valid
- [ ] Enough disk space (3GB+)
- [ ] No other builds running

If build fails:
1. Read error message carefully
2. Google the specific error
3. Try clean build (delete dist/, node_modules/.cache/)
4. Check this guide's Common Errors section

---

## Summary

**Best Practice:**
1. ✅ Build macOS on macOS (you're already here!)
2. ✅ Build Windows on Windows (borrow a PC or use VM)
3. ✅ Test both builds thoroughly
4. ✅ Get code signing if distributing widely
5. ✅ Upload to cloud storage or GitHub Releases

**Quick Method:**
1. ✅ Build macOS: `npm run build:mac`
2. ⚠️ Build Windows: `npm run build:win` (from macOS with Wine)
3. ⚠️ Test on Windows (will show security warning)
4. ✅ Share both installers

Your Windows installer will work, but users will see a warning unless you code-sign it!

---

## Need Help?

**Still getting errors?**

1. Copy the EXACT error message
2. Include output of:
   ```bash
   node --version
   npm --version
   pwd
   ls -la package.json
   ```
3. Describe what command you ran
4. Let me know which Method you're using (Windows machine or macOS cross-compile)

Good luck building! 🚀
