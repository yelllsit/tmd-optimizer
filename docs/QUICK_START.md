# Quick Start Guide

## Running the App

The application should already be running! If not, use:

```bash
cd /Users/khayel/tiktok-video-optimizer
npm start
```

## First Time Setup

### Step 1: Generate a License Key

When the app opens, you'll see a license activation screen:

1. Scroll to "Generate Demo License" section
2. Enter any email address (e.g., `your@email.com`)
3. Click "Generate Demo License"
4. A license key will appear in the box above (looks like: `ABCD-EFGH-IJKL-MNOP`)

### Step 2: Activate the License

1. Copy the generated license key
2. Scroll up to "Enter License Key" section
3. Paste the license key
4. Click "Activate License"
5. You should see "License activated!" message

The app will then open and you're ready to use it!

## Using the App

### Adding Videos

**Option 1: Drag & Drop**
- Drag video files directly onto the drop zone

**Option 2: Browse**
- Click "Browse Files" button
- Select one or multiple videos

### Selecting Quality

Choose from three presets:
- **Standard**: Good quality, smaller files (1080p, 4Mbps)
- **High Quality**: Better quality (1080p, 6Mbps) - RECOMMENDED
- **4K**: Best quality, larger files (2160p, 15Mbps)

### Processing

1. Click "Browse" next to "Output Directory"
2. Choose where to save optimized videos
3. Click "Process Videos"
4. Wait for processing to complete
5. Your optimized videos will be in the output folder with "_tiktok_optimized.mp4" added to the filename

## What This App Does

✅ Optimizes video encoding for TikTok upload
✅ Converts to 9:16 vertical format
✅ Uses high-quality settings to minimize quality loss
✅ Batch processes multiple videos
✅ Shows real-time progress

⚠️ **Important**: TikTok will still re-encode videos on their servers. This app prepares your videos to lose as little quality as possible during that process.

## Tips for Best Results

1. Start with the highest quality source videos
2. Use "High Quality" or "4K" preset for best results
3. TikTok will still compress to 30fps - this is normal
4. The 9:16 format (vertical) is ideal for TikTok

## Troubleshooting

**App won't start?**
- Make sure Node.js is installed
- Run `npm install` in the project folder

**License won't activate?**
- Copy the ENTIRE license key
- Make sure there are no extra spaces

**Videos won't process?**
- Check that you selected an output directory
- Make sure you have enough disk space
- Verify the input files are valid videos

## Need Help?

Check the full README.md for more detailed information.
