const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { validateLicense, generateLicense } = require('./license');
const { processVideo, getVideoInfo } = require('./videoProcessor');
const { sendVerificationCode: sendEmailCode, isDemoMode } = require('./emailService');

let mainWindow;
let isLicenseValid = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      enableRemoteModule: false,
      webSecurity: true
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0a0a0a'
  });

  mainWindow.loadFile(path.join(__dirname, '../public/index-new.html'));

  // Enable file drag and drop
  mainWindow.webContents.on('will-navigate', (event, url) => {
    event.preventDefault();
  });

  // Open DevTools in development
  // mainWindow.webContents.openDevTools(); // Disabled for production
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// License validation
ipcMain.handle('validate-license', async (event, licenseKey, rememberMe = false) => {
  try {
    const result = validateLicense(licenseKey);
    isLicenseValid = result.valid;

    if (result.valid && rememberMe) {
      // Store license key with "remember until" timestamp (3 days)
      const userDataPath = app.getPath('userData');
      const licensePath = path.join(userDataPath, 'license.key');
      const rememberUntilPath = path.join(userDataPath, 'license.remember');

      const rememberUntil = new Date();
      rememberUntil.setDate(rememberUntil.getDate() + 3); // 3 days from now

      fs.writeFileSync(licensePath, licenseKey);
      fs.writeFileSync(rememberUntilPath, rememberUntil.toISOString());
    }

    return result;
  } catch (error) {
    return { valid: false, message: 'License validation failed' };
  }
});

// Check stored license on startup
ipcMain.handle('check-stored-license', async () => {
  try {
    const userDataPath = app.getPath('userData');
    const licensePath = path.join(userDataPath, 'license.key');
    const rememberUntilPath = path.join(userDataPath, 'license.remember');
    const oldActivationPath = path.join(userDataPath, 'license.activation');

    // Clean up old activation file if it exists
    if (fs.existsSync(oldActivationPath)) {
      fs.unlinkSync(oldActivationPath);
    }

    // Check if license exists
    if (!fs.existsSync(licensePath)) {
      return { valid: false, message: 'Please enter your license key', remembered: false };
    }

    // Check if "remember me" period is still valid
    if (!fs.existsSync(rememberUntilPath)) {
      return { valid: false, message: 'Please enter your license key', remembered: false };
    }

    const licenseKey = fs.readFileSync(licensePath, 'utf8');
    const rememberUntil = new Date(fs.readFileSync(rememberUntilPath, 'utf8'));
    const now = new Date();

    // Check if remember period has expired (3 days)
    if (now >= rememberUntil) {
      // Clear stored license
      fs.unlinkSync(licensePath);
      fs.unlinkSync(rememberUntilPath);
      return {
        valid: false,
        message: 'Remember period expired. Please enter your license key.',
        remembered: false
      };
    }

    // Validate the license
    const result = validateLicense(licenseKey);
    isLicenseValid = result.valid;

    if (result.valid) {
      // Calculate remaining time for both remember period and license expiry
      const hoursUntilForget = Math.ceil((rememberUntil - now) / (1000 * 60 * 60));
      const daysUntilForget = Math.ceil(hoursUntilForget / 24);

      return {
        ...result,
        remembered: true,
        rememberExpiresIn: `${daysUntilForget} day${daysUntilForget !== 1 ? 's' : ''}`,
        hoursUntilForget: hoursUntilForget
      };
    }

    return result;
  } catch (error) {
    return { valid: false, message: 'Error checking license', remembered: false };
  }
});

// Generate verification code for 2FA
const verificationCodes = new Map(); // Store codes temporarily

ipcMain.handle('send-verification-code', async (event, email) => {
  try {
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store code with expiry (5 minutes)
    verificationCodes.set(email, {
      code,
      expiry: Date.now() + 5 * 60 * 1000
    });

    // Send email via email service
    const result = await sendEmailCode(email, code);

    if (result.success) {
      // In demo mode, return the code for display
      // In production mode, don't return the code
      return {
        success: true,
        message: result.message,
        code: isDemoMode() ? code : undefined
      };
    } else {
      return {
        success: false,
        message: result.message
      };
    }
  } catch (error) {
    return { success: false, message: 'Failed to send verification code' };
  }
});

// Verify code and generate license
ipcMain.handle('verify-and-generate-license', async (event, email, code, days) => {
  try {
    const stored = verificationCodes.get(email);

    if (!stored) {
      return { success: false, message: 'No verification code found. Please request a new one.' };
    }

    if (Date.now() > stored.expiry) {
      verificationCodes.delete(email);
      return { success: false, message: 'Verification code expired. Please request a new one.' };
    }

    if (stored.code !== code) {
      return { success: false, message: 'Invalid verification code.' };
    }

    // Code is valid, generate license
    verificationCodes.delete(email);
    const license = generateLicense(email, days);
    return { success: true, license };
  } catch (error) {
    return { success: false, message: 'Failed to generate license' };
  }
});

// Select video files
ipcMain.handle('select-files', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Videos', extensions: ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv'] }
    ]
  });

  if (result.canceled) {
    return { canceled: true };
  }

  return { canceled: false, filePaths: result.filePaths };
});

// Get video information
ipcMain.handle('get-video-info', async (event, filePath) => {
  if (!isLicenseValid) {
    return { success: false, message: 'Valid license required' };
  }

  try {
    const info = await getVideoInfo(filePath);
    return { success: true, info };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

// Process video with optimization
ipcMain.handle('process-video', async (event, options) => {
  if (!isLicenseValid) {
    return { success: false, message: 'Valid license required' };
  }

  try {
    // If outputDir is provided instead of outputPath, construct the output path
    if (options.outputDir && !options.outputPath) {
      const inputFileName = path.basename(options.inputPath, path.extname(options.inputPath));
      const outputFileName = `${inputFileName}_optimized.mp4`;
      options.outputPath = path.join(options.outputDir, outputFileName);
    }

    const result = await processVideo(options, (progress) => {
      mainWindow.webContents.send('processing-progress', {
        filePath: options.inputPath,
        progress: progress.percent || 0
      });
    });

    return { success: true, outputPath: result };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

// Select output directory
ipcMain.handle('select-output-dir', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory', 'createDirectory']
  });

  if (result.canceled) {
    return { canceled: true };
  }

  return { canceled: false, path: result.filePaths[0] };
});
