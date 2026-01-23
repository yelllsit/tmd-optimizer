const { contextBridge, ipcRenderer, shell } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // License operations
  validateLicense: (licenseKey, rememberMe) => ipcRenderer.invoke('validate-license', licenseKey, rememberMe),
  checkStoredLicense: () => ipcRenderer.invoke('check-stored-license'),
  sendVerificationCode: (email) => ipcRenderer.invoke('send-verification-code', email),
  verifyAndGenerateLicense: (email, code, days) => ipcRenderer.invoke('verify-and-generate-license', email, code, days),

  // File operations
  selectFiles: () => ipcRenderer.invoke('select-files'),
  selectOutputDir: () => ipcRenderer.invoke('select-output-dir'),

  // Video operations
  getVideoInfo: (filePath) => ipcRenderer.invoke('get-video-info', filePath),
  processVideo: (options) => ipcRenderer.invoke('process-video', options),

  // External links
  openExternal: (url) => shell.openExternal(url),

  // Progress updates
  onProcessingProgress: (callback) => {
    ipcRenderer.on('processing-progress', (event, data) => callback(data));
  }
});
