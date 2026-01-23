# Latest Updates - TMD Opti

## 🎉 Three Major Features Added!

---

## ✅ Feature 1: Discord Bot - View Your License Keys

### New Command: `/mylicenses`

Users can now see all their generated license keys directly in Discord!

**How to use:**
```
/mylicenses
```

**What it shows:**
- All license keys you've generated
- Status of each key (Active, Expired, Invalid)
- Email associated with each key
- Duration (how many days)
- When it was generated
- The actual license key (so you can copy it again!)

**Example Output:**
```
🔑 Your License Keys
You have 2 license key(s)

✅ License #1 - Active
Email: user@example.com
Duration: 30 day(s)
Generated: 1/22/2026
Key:
U2Fsd-GVkX-1234-5678-9abc-defg

⏰ License #2 - Expired
Email: user@example.com
Duration: 1 day(s)
Generated: 1/15/2026
Key:
ABCD-EFGH-IJKL-MNOP-QRST-UVWX
```

**Benefits:**
- ✅ Never lose your license key again
- ✅ See all your keys in one place
- ✅ Check status without entering the app
- ✅ Easily copy keys to share or use

---

## ✅ Feature 2: 7-Day Re-Activation System

### Smart License Storage

The app now **remembers your license** but requires **re-activation every 7 days** for security.

**How it works:**

1. **First time:** Enter your license key
2. **App remembers it:** Next time you open the app, it auto-loads
3. **After 7 days:** You must re-activate (key is pre-filled, just click activate)
4. **Continues:** Every 7 days, re-activation required

**Example flow:**

**Day 1:**
```
- Enter license key: XXXX-XXXX-XXXX
- Click "Activate License"
- App opens
```

**Day 2-6:**
```
- Open app
- Automatically logged in!
- No license entry needed
```

**Day 7+:**
```
- Open app
- Message: "Please re-activate your license (7 days have passed)"
- Your license key is PRE-FILLED in the box
- Just click "Activate License" again
- App opens
```

**License Status Display:**

While using the app, you'll see:
```
Licensed to: user@example.com | 29d 23h 45m remaining | Re-activate in 4d
                                 ↑ License expiry      ↑ Re-activation timer
```

**Benefits:**
- ✅ Don't need to enter key every time
- ✅ Security: Re-activation every 7 days
- ✅ Key is pre-filled when re-activation needed
- ✅ See countdown for both expiry and re-activation

---

## ✅ Feature 3: Buy License Button

### Direct Link to Discord

Added a **"💎 Buy License Key"** button that opens your Discord server!

**Location:**
- In the license activation screen
- Right below the "Activate License" button
- Above the demo license generator

**What it does:**
- Clicks → Opens Discord in default browser
- Link: https://discord.gg/GX2qBwQ3a9
- User can join server and purchase/request licenses

**UI:**
```
┌─────────────────────────────┐
│  Enter License Key          │
│  [XXXX-XXXX-XXXX-XXXX]     │
│  [Activate License]         │
│                             │
│  [💎 Buy License Key]       │  ← NEW!
│                             │
│         OR                  │
│                             │
│  Generate Demo License      │
└─────────────────────────────┘
```

---

## 📋 Summary of All Changes

### Discord Bot Updates:

| Feature | Command | Description |
|---------|---------|-------------|
| Generate License | `/generate` | Create a new license with duration options |
| **View Your Licenses** | `/mylicenses` | **NEW! See all your license keys** |
| Verify License | `/verify` | Check if a license is valid |
| Bot Info | `/info` | Shows bot commands |

### Application Updates:

| Feature | Old Behavior | New Behavior |
|---------|-------------|--------------|
| License Storage | Enter every time | **Remembered for 7 days** |
| Re-activation | N/A | **Required every 7 days** |
| License Key | Manual entry | **Pre-filled on re-activation** |
| Purchase | No option | **"Buy License" button → Discord** |
| Status Display | Time remaining | **Time remaining + Re-activation countdown** |

---

## 🚀 Testing Guide

### Test 1: View Your Licenses (Discord Bot)

1. **Start Discord bot:**
   ```bash
   cd /Users/khayel/tiktok-video-optimizer/discord-bot
   npm start
   ```

2. **Generate a few licenses:**
   ```
   /generate email:test1@example.com duration:7 Days
   /generate email:test2@example.com duration:30 Days
   ```

3. **View your licenses:**
   ```
   /mylicenses
   ```

4. **You should see:**
   - List of all licenses you generated
   - Status of each (Active/Expired)
   - Full license keys displayed

### Test 2: 7-Day Re-Activation

1. **First activation:**
   - Open TMD Opti
   - Enter a license key
   - Click "Activate License"
   - App opens

2. **Close and reopen (same day):**
   - Open TMD Opti
   - Should automatically log in (no license entry needed!)

3. **Test re-activation (simulate 7 days):**
   - For testing, you can manually delete:
     ```bash
     rm ~/Library/Application\ Support/tmd-opti/license.activation
     ```
   - Reopen app
   - Should show: "Please re-activate your license"
   - License key is PRE-FILLED
   - Just click "Activate License"

4. **Check status display:**
   - After activation, look at top-right corner
   - Should show: `Licensed to: email | Xd Xh Xm remaining | Re-activate in Xd`

### Test 3: Buy License Button

1. **Open TMD Opti**
2. **On license screen, click "💎 Buy License Key"**
3. **Discord server should open in your browser**
4. **Link: https://discord.gg/GX2qBwQ3a9**

---

## 🎯 User Flow Examples

### Example 1: New User Buys License

1. User opens TMD Opti
2. Sees "💎 Buy License Key" button
3. Clicks it → Opens Discord
4. Joins Discord server
5. Requests license via `/generate`
6. Uses `/mylicenses` to see their key
7. Copies key from Discord
8. Pastes in TMD Opti
9. Activates and starts using

### Example 2: Existing User (Day 3)

1. User opens TMD Opti
2. App auto-loads (license remembered!)
3. Sees: `Re-activate in 4d`
4. Uses app normally
5. Closes app

### Example 3: Existing User (Day 8)

1. User opens TMD Opti
2. Message: "Please re-activate your license (7 days have passed)"
3. License key is already filled in the box
4. Clicks "Activate License"
5. App opens
6. Status shows: `Re-activate in 7d` (reset to 7 days)

### Example 4: User Forgets License Key

1. User needs to re-activate
2. But forgot their license key
3. Opens Discord
4. Types: `/mylicenses`
5. Sees all their license keys
6. Copies the key
7. Pastes in TMD Opti
8. Activates successfully

---

## 🔧 Technical Details

### License Storage Files:

**Location:** `~/Library/Application Support/tmd-opti/`

**Files:**
- `license.key` - Stores the encrypted license key
- `license.activation` - Stores last activation timestamp (ISO format)

**Re-activation Logic:**
```javascript
// Check if 7 days have passed since last activation
const lastActivation = new Date(activationTimestamp);
const now = new Date();
const daysSinceActivation = (now - lastActivation) / (1000 * 60 * 60 * 24);

if (daysSinceActivation >= 7) {
  // Require re-activation
  // But pre-fill the stored license key
}
```

### Discord Bot Storage:

**Structure:**
```javascript
Map<userId, Array<{
  licenseKey: string,
  email: string,
  days: number,
  generatedAt: string,
  userTag: string
}>>
```

**In Production:**
Replace `Map()` with a database (MongoDB, PostgreSQL, etc.)

---

## 📝 Discord Bot Commands Summary

### Updated Commands:

```
/generate email:user@example.com duration:30 Days
→ Generates a license and stores it under your user ID

/mylicenses
→ Shows all licenses YOU generated
→ Includes status, email, duration, generation date, and the key itself

/verify key:XXXX-XXXX-XXXX
→ Checks if a key is valid, expired, or invalid

/info
→ Shows bot information and available commands
```

---

## 🎨 UI Changes

### License Screen:

**Before:**
```
┌─────────────────────────────┐
│  Enter License Key          │
│  [Input]                    │
│  [Activate License]         │
│                             │
│  OR                         │
│                             │
│  Generate Demo License      │
└─────────────────────────────┘
```

**After:**
```
┌─────────────────────────────┐
│  Enter License Key          │
│  [Input - Pre-filled if     │
│   re-activation needed]     │
│  [Activate License]         │
│                             │
│  [💎 Buy License Key] ← NEW │
│                             │
│  OR                         │
│                             │
│  Generate Demo License      │
│  (1 Day trial)              │
└─────────────────────────────┘
```

### Header Status:

**Before:**
```
Licensed to: user@example.com | 29d 23h 45m remaining
```

**After:**
```
Licensed to: user@example.com | 29d 23h 45m remaining | Re-activate in 4d
                                ↑ License expiry      ↑ NEW: Re-activation timer
```

---

## 💡 Benefits Summary

### For Users:
- ✅ Never lose license keys (stored in Discord)
- ✅ Don't need to enter key every time (7-day memory)
- ✅ Easy to buy licenses (direct Discord link)
- ✅ See all their licenses at once
- ✅ Check license status without opening app
- ✅ Key is pre-filled on re-activation

### For You (Developer):
- ✅ Users can self-serve (check their own keys)
- ✅ Better security (7-day re-activation)
- ✅ Easier customer support (users can see their keys)
- ✅ Direct sales channel (Discord link)
- ✅ Track all generated licenses
- ✅ Users less likely to lose keys

---

## 🚨 Important Notes

### Demo Licenses:
- Still fixed at **1 day only**
- Use Discord bot for longer durations (1d, 3d, 7d, 30d, 90d, 360d)

### Discord Bot Storage:
- Currently uses in-memory `Map()`
- For production, use a real database
- Bot restart will lose license history
- Consider adding file-based storage or database

### Re-activation Timer:
- Resets every 7 days
- Based on last activation date
- Not based on license expiry
- Independent of license duration

---

## 📚 Files Modified

### Application:
- `src/main.js` - 7-day re-activation logic
- `src/preload.js` - Added `openExternal` for Discord link
- `public/index.html` - Added "Buy License" button
- `public/renderer.js` - Re-activation handling, buy button, status display

### Discord Bot:
- `discord-bot/bot.js` - Added `/mylicenses` command, user-based storage

---

## 🎉 Summary

**Three major features added:**

1. **Discord Bot `/mylicenses`** - View all your license keys anytime
2. **7-Day Re-Activation** - Remember license but require re-activation for security
3. **Buy License Button** - Direct link to Discord server

All features are working and ready to test!

**Quick Test:**
```bash
# Start app
npm start

# Start Discord bot
cd discord-bot
npm start

# In Discord:
/generate email:test@example.com duration:30 Days
/mylicenses
```

Enjoy the new features! 🚀
