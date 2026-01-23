const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

// Video optimization presets
// Dual-mode system: Quality Enhancement + Resolution Optimizer

// Mode 1: Quality Enhancement (H.264, 30fps)
const QUALITY_PRESETS = {
  standard: {
    videoCodec: 'libx264',
    videoBitrate: '4000k',
    audioBitrate: '192k',
    audioCodec: 'aac',
    width: 1920,
    height: 1080,
    fps: 30,
    preset: 'medium',
    pixelFormat: 'yuv420p',
    crf: 23
  },
  high: {
    videoCodec: 'libx264',
    videoBitrate: '6000k',
    audioBitrate: '256k',
    audioCodec: 'aac',
    width: 1920,
    height: 1080,
    fps: 30,
    preset: 'medium',
    pixelFormat: 'yuv420p',
    crf: 20
  },
  '4k': {
    videoCodec: 'libx264',
    videoBitrate: '15000k',
    audioBitrate: '320k',
    audioCodec: 'aac',
    width: 3840,
    height: 2160,
    fps: 30,
    preset: 'medium',
    pixelFormat: 'yuv420p',
    crf: 20
  }
};

// Mode 2: Resolution Optimizer (H.265, 60fps)
const RESOLUTION_PRESETS = {
  horizontal: {
    videoCodec: 'libx265',
    videoBitrate: '8000k',
    audioBitrate: '256k',
    audioCodec: 'aac',
    width: 1440,
    height: 1080,
    fps: 60,
    preset: 'medium',
    pixelFormat: 'yuv420p',
    crf: 23
  },
  vertical: {
    videoCodec: 'libx265',
    videoBitrate: '8000k',
    audioBitrate: '256k',
    audioCodec: 'aac',
    width: 1080,
    height: 1440,
    fps: 60,
    preset: 'medium',
    pixelFormat: 'yuv420p',
    crf: 23
  }
};

// Combined presets for backward compatibility
const VIDEO_PRESETS = {
  ...QUALITY_PRESETS,
  ...RESOLUTION_PRESETS
};

// Get video information
function getVideoInfo(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }

      const videoStream = metadata.streams.find(s => s.codec_type === 'video');
      const audioStream = metadata.streams.find(s => s.codec_type === 'audio');

      if (!videoStream) {
        reject(new Error('No video stream found'));
        return;
      }

      // Format file size
      const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
        return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
      };

      // Format duration
      const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      };

      const info = {
        duration: formatDuration(metadata.format.duration),
        size: formatSize(metadata.format.size),
        bitrate: metadata.format.bit_rate,
        width: videoStream.width,
        height: videoStream.height,
        video: {
          codec: videoStream.codec_name,
          width: videoStream.width,
          height: videoStream.height,
          fps: eval(videoStream.r_frame_rate),
          bitrate: videoStream.bit_rate
        },
        audio: audioStream ? {
          codec: audioStream.codec_name,
          bitrate: audioStream.bit_rate,
          sampleRate: audioStream.sample_rate
        } : null
      };

      resolve(info);
    });
  });
}

// Process video with optimization
function processVideo(options, progressCallback) {
  return new Promise((resolve, reject) => {
    const { inputPath, outputPath, mode, preset, customSettings } = options;

    // Select preset based on mode
    let settings;
    if (customSettings) {
      settings = customSettings;
    } else if (mode === 'quality') {
      settings = QUALITY_PRESETS[preset] || QUALITY_PRESETS.standard;
    } else if (mode === 'resolution') {
      settings = RESOLUTION_PRESETS[preset] || RESOLUTION_PRESETS.horizontal;
    } else {
      // Fallback for backward compatibility
      settings = VIDEO_PRESETS[preset] || QUALITY_PRESETS.standard;
    }

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    let command = ffmpeg(inputPath);

    // Apply video settings with proper upscaling
    command
      .videoCodec(settings.videoCodec)
      .videoBitrate(settings.videoBitrate)
      .fps(settings.fps);

    // Build scale filter for proper upscaling
    const scaleFilter = `scale=${settings.width}:${settings.height}:flags=lanczos`;

    command.videoFilters([
      {
        filter: 'scale',
        options: {
          w: settings.width,
          h: settings.height,
          flags: 'lanczos' // High-quality upscaling algorithm
        }
      }
    ]);

    // Apply advanced H.265 encoding settings
    const outputOptions = [
      `-preset ${settings.preset}`,
      `-pix_fmt ${settings.pixelFormat}`,
      `-crf ${settings.crf}`, // Quality setting for H.265
      '-movflags +faststart', // Enable streaming
      '-g 120', // GOP size for 60fps (2 seconds)
      '-tag:v hvc1' // Compatibility tag for H.265
    ];

    command.outputOptions(outputOptions);

    // Apply audio settings
    if (settings.audioCodec) {
      command
        .audioCodec(settings.audioCodec)
        .audioBitrate(settings.audioBitrate)
        .audioChannels(2)
        .audioFrequency(48000);
    }

    // Progress tracking
    command.on('progress', (progress) => {
      if (progressCallback) {
        progressCallback({
          percent: progress.percent || 0,
          currentFps: progress.currentFps,
          currentKbps: progress.currentKbps,
          targetSize: progress.targetSize,
          timemark: progress.timemark
        });
      }
    });

    // Handle completion
    command.on('end', () => {
      resolve(outputPath);
    });

    // Handle errors
    command.on('error', (err) => {
      reject(new Error(`FFmpeg error: ${err.message}`));
    });

    // Save to output path
    command.save(outputPath);
  });
}

// Batch process multiple videos
async function batchProcessVideos(files, outputDir, preset, progressCallback) {
  const results = [];

  for (let i = 0; i < files.length; i++) {
    const inputPath = files[i];
    const fileName = path.basename(inputPath, path.extname(inputPath));
    const outputPath = path.join(outputDir, `${fileName}_optimized.mp4`);

    try {
      await processVideo(
        { inputPath, outputPath, preset },
        (progress) => {
          if (progressCallback) {
            progressCallback({
              fileIndex: i,
              totalFiles: files.length,
              fileName: path.basename(inputPath),
              ...progress
            });
          }
        }
      );

      results.push({ success: true, inputPath, outputPath });
    } catch (error) {
      results.push({ success: false, inputPath, error: error.message });
    }
  }

  return results;
}

module.exports = {
  getVideoInfo,
  processVideo,
  batchProcessVideos,
  VIDEO_PRESETS
};
