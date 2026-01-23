# TikTok Video Optimizer

A desktop application that optimizes videos for TikTok upload, ensuring maximum quality retention through TikTok's compression process.

## Features

- **License Key System**: Secure activation with email-based license keys
- **TikTok Optimization Presets**: Multiple quality presets optimized for TikTok
  - Standard Quality (1080p, 4Mbps)
  - High Quality (1080p, 6Mbps)
  - 4K Quality (2160p, 15Mbps)
- **Batch Processing**: Process multiple videos at once
- **Drag & Drop**: Easy video file selection
- **Real-time Progress**: Monitor encoding progress for each video
- **Optimal Settings**: Videos are pre-optimized to minimize quality loss during TikTok's re-encoding

## How It Works

While TikTok will still re-encode your videos to their platform specifications (typically 30fps, compressed resolution), this app prepares your videos in a way that minimizes quality degradation:

1. **Optimal Encoding**: Uses high-quality encoding settings with proper bitrates
2. **Aspect Ratio**: Converts to 9:16 vertical format ideal for TikTok
3. **Frame Rate Matching**: Encodes at 30fps to match TikTok's output, avoiding double compression
4. **Smart Compression**: Uses advanced FFmpeg settings for best quality retention

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm

### Setup

1. Navigate to the project directory:
   ```bash
   cd tiktok-video-optimizer
   ```

2. Install dependencies (already done):
   ```bash
   npm install
   ```

3. Run the application:
   ```bash
   npm start
   ```

## Usage

### First Launch - Activate License

1. **Generate Demo License**:
   - Enter your email in the demo license section
   - Click "Generate Demo License"
   - Copy the generated license key
   - Paste it in the "Enter License Key" field
   - Click "Activate License"

2. **Or Enter Existing License**:
   - Paste your license key directly
   - Click "Activate License"

### Processing Videos

1. **Add Videos**:
   - Drag and drop video files onto the drop zone, OR
   - Click "Browse Files" to select videos

2. **Select Quality Preset**:
   - Standard: 1080p at 4Mbps (good for most use cases)
   - High Quality: 1080p at 6Mbps (better quality, larger file)
   - 4K: 2160p at 15Mbps (best quality, largest file)

3. **Choose Output Directory**:
   - Click "Browse" next to Output Directory
   - Select where you want the optimized videos saved

4. **Process**:
   - Click "Process Videos"
   - Monitor progress for each video
   - Optimized videos will be saved with "_tiktok_optimized.mp4" suffix

## Building the Application

### For macOS:
```bash
npm run build:mac
```

### For Windows:
```bash
npm run build:win
```

### For Linux:
```bash
npm run build:linux
```

## Technical Details

### Video Encoding Settings

The app uses FFmpeg with optimized settings:
- **Video Codec**: H.264 (libx264)
- **Preset**: Slow/Very Slow for better compression
- **Profile**: High
- **Pixel Format**: YUV 4:2:0
- **Audio**: AAC, 48kHz, stereo

### Supported Input Formats

- MP4
- MOV
- AVI
- MKV
- WebM
- FLV

### Output Format

All videos are exported as MP4 with H.264 video and AAC audio.

## License Key System

The application includes a license key system for activation:

- **License Generation**: Generate demo licenses for testing
- **License Validation**: Secure cryptographic validation
- **Expiry Tracking**: Licenses have validity periods
- **Persistent Storage**: License is saved locally after activation

**Note**: The demo license generator is included for testing purposes. In a production environment, license generation should be handled server-side.

## Limitations

- TikTok will still re-encode videos on their servers to their platform specifications
- The app cannot bypass TikTok's 30fps limit or their compression
- What this app DOES: Prepares videos in the optimal format to minimize quality loss during TikTok's processing

## Troubleshooting

### FFmpeg Not Found
If you get FFmpeg errors, the `@ffmpeg-installer/ffmpeg` package should automatically include FFmpeg. If issues persist, install FFmpeg manually:
- macOS: `brew install ffmpeg`
- Windows: Download from ffmpeg.org
- Linux: `sudo apt install ffmpeg`

### License Won't Activate
- Ensure you copied the complete license key
- Check that the license hasn't expired
- Try generating a new demo license

### Videos Won't Process
- Ensure input files are valid video files
- Check that you have write permissions to the output directory
- Verify FFmpeg is installed correctly

## Development

Run in development mode with DevTools:
```bash
npm run dev
```

## Credits

Built with:
- Electron
- FFmpeg (via fluent-ffmpeg)
- crypto-js

---

**Disclaimer**: This app optimizes videos for TikTok upload but cannot bypass TikTok's server-side video processing. The goal is to minimize quality loss during TikTok's compression, not to circumvent platform limitations.
