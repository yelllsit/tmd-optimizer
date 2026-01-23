// State management
const state = {
    files: [],
    selectedPreset: 'horizontal',
    outputDir: null,
    isProcessing: false,
    licenseInfo: null,
    countdownInterval: null
};

// DOM elements
const licenseModal = document.getElementById('licenseModal');
const mainApp = document.getElementById('mainApp');
const licenseInput = document.getElementById('licenseInput');
const emailInput = document.getElementById('emailInput');
const validateBtn = document.getElementById('validateBtn');
const generateBtn = document.getElementById('generateBtn');
const buyLicenseBtn = document.getElementById('buyLicenseBtn');
const licenseMessage = document.getElementById('licenseMessage');
const licenseStatus = document.getElementById('licenseStatus');
const dropZone = document.getElementById('dropZone');
const browseBtn = document.getElementById('browseBtn');
const filesList = document.getElementById('filesList');
const fileCount = document.getElementById('fileCount');
const processBtn = document.getElementById('processBtn');
const clearBtn = document.getElementById('clearBtn');
const selectDirBtn = document.getElementById('selectDirBtn');
const outputDirInput = document.getElementById('outputDir');
const presetBtns = document.querySelectorAll('.preset-btn');

// Initialize app
async function init() {
    // Check for stored license
    const result = await window.electronAPI.checkStoredLicense();
    if (result.valid) {
        showMainApp(result);
    } else if (result.needsReactivation && result.storedLicenseKey) {
        // Pre-fill license key for re-activation
        licenseInput.value = result.storedLicenseKey;
        showMessage(result.message + ' - Your key has been pre-filled below.', 'error');
    } else if (result.message && result.message !== 'No license found') {
        showMessage(result.message, 'error');
    }

    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    // License validation
    validateBtn.addEventListener('click', handleValidateLicense);
    generateBtn.addEventListener('click', handleGenerateLicense);
    buyLicenseBtn.addEventListener('click', handleBuyLicense);

    // File selection
    browseBtn.addEventListener('click', handleBrowseFiles);
    dropZone.addEventListener('click', (e) => {
        if (e.target === dropZone || e.target.closest('.drop-zone-content')) {
            browseBtn.click();
        }
    });

    // Drag and drop
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);
    dropZone.addEventListener('dragenter', handleDragOver);

    // Prevent default drag/drop behavior on document
    document.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
    });
    document.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
    });

    // Preset selection
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            presetBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.selectedPreset = btn.dataset.preset;
        });
    });

    // Output directory
    selectDirBtn.addEventListener('click', handleSelectOutputDir);

    // Process and clear
    processBtn.addEventListener('click', handleProcessVideos);
    clearBtn.addEventListener('click', handleClearQueue);

    // Progress updates
    window.electronAPI.onProcessingProgress((data) => {
        updateFileProgress(data);
    });

    // Allow Enter key on license input
    licenseInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleValidateLicense();
    });

    emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleGenerateLicense();
    });
}

// License handlers
async function handleValidateLicense() {
    const licenseKey = licenseInput.value.trim();

    if (!licenseKey) {
        showMessage('Please enter a license key', 'error');
        return;
    }

    validateBtn.disabled = true;
    validateBtn.textContent = 'Validating...';

    const result = await window.electronAPI.validateLicense(licenseKey);

    if (result.valid) {
        showMessage(`License activated! Valid until ${new Date(result.expiry).toLocaleDateString()}`, 'success');
        setTimeout(() => showMainApp(result), 1500);
    } else {
        showMessage(result.message, 'error');
        validateBtn.disabled = false;
        validateBtn.textContent = 'Activate License';
    }
}

async function handleGenerateLicense() {
    const email = emailInput.value.trim();
    const days = 1; // Demo licenses are always 1 day

    if (!email || !email.includes('@')) {
        showMessage('Please enter a valid email', 'error');
        return;
    }

    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';

    const result = await window.electronAPI.generateLicense(email, days);

    if (result.success) {
        licenseInput.value = result.license;
        showMessage('1-day demo license generated! Click "Activate License" above to use it.', 'success');
        emailInput.value = '';
    } else {
        showMessage('Failed to generate license', 'error');
    }

    generateBtn.disabled = false;
    generateBtn.textContent = 'Generate 1-Day Demo License';
}

function handleBuyLicense() {
    // Open Discord server in default browser
    window.electronAPI.openExternal('https://discord.gg/GX2qBwQ3a9');
}

function showMessage(message, type) {
    licenseMessage.textContent = message;
    licenseMessage.className = `message ${type}`;
}

function showMainApp(licenseInfo) {
    licenseModal.classList.add('hidden');
    mainApp.classList.remove('hidden');

    // Store license info
    state.licenseInfo = licenseInfo;

    // Start countdown timer
    updateLicenseCountdown();

    // Update countdown every minute
    if (state.countdownInterval) {
        clearInterval(state.countdownInterval);
    }
    state.countdownInterval = setInterval(updateLicenseCountdown, 60000); // Update every minute
}

function updateLicenseCountdown() {
    if (!state.licenseInfo) return;

    const now = new Date();
    const expiryDate = new Date(state.licenseInfo.expiry);
    const timeRemaining = expiryDate - now;

    if (timeRemaining <= 0) {
        licenseStatus.textContent = '⚠️ License Expired';
        licenseStatus.style.color = '#ffffff';
        if (state.countdownInterval) {
            clearInterval(state.countdownInterval);
        }
        // Optionally show license modal again
        setTimeout(() => {
            licenseModal.classList.remove('hidden');
            mainApp.classList.add('hidden');
            showMessage('Your license has expired. Please activate a new license.', 'error');
        }, 2000);
        return;
    }

    // Calculate time remaining
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

    // Format display
    let timeText = '';
    if (days > 0) {
        timeText = `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
        timeText = `${hours}h ${minutes}m`;
    } else {
        timeText = `${minutes}m`;
    }

    const email = state.licenseInfo.email || 'Demo';

    // Add re-activation reminder if available
    let reactivationText = '';
    if (state.licenseInfo.daysUntilReactivation !== undefined) {
        const daysUntil = state.licenseInfo.daysUntilReactivation;
        reactivationText = ` | Re-activate in ${daysUntil}d`;
    }

    licenseStatus.textContent = `Licensed to: ${email} | ${timeText} remaining${reactivationText}`;
}

// File selection handlers
async function handleBrowseFiles() {
    const result = await window.electronAPI.selectFiles();

    if (!result.canceled && result.filePaths) {
        addFiles(result.filePaths);
    }
}

function handleDragOver(e) {
    e.preventDefault();
    dropZone.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
}

async function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('drag-over');

    const files = Array.from(e.dataTransfer.files);

    // In Electron with contextIsolation, we need to get paths differently
    const filePaths = files.map(f => {
        // Try to get path property (available in Electron)
        return f.path || f.name;
    });

    if (filePaths.length > 0) {
        await addFiles(filePaths);
    }
}

async function addFiles(filePaths) {
    if (!filePaths || filePaths.length === 0) {
        console.log('No files to add');
        return;
    }

    console.log('Adding files:', filePaths);

    for (const filePath of filePaths) {
        // Skip if no path
        if (!filePath) continue;

        // Check if already added
        if (state.files.find(f => f.path === filePath)) {
            console.log('File already added:', filePath);
            continue;
        }

        try {
            const info = await window.electronAPI.getVideoInfo(filePath);

            if (info.success) {
                state.files.push({
                    path: filePath,
                    name: filePath.split('/').pop().split('\\').pop(), // Handle both / and \ path separators
                    info: info.info,
                    status: 'pending',
                    progress: 0
                });
                console.log('File added successfully:', filePath);
            } else {
                console.error('Failed to get video info:', info.message);
                alert(`Failed to add ${filePath.split('/').pop()}: ${info.message}`);
            }
        } catch (error) {
            console.error('Error adding file:', error);
            alert(`Error adding file: ${error.message}`);
        }
    }

    renderFilesList();
    updateProcessButton();
}

function renderFilesList() {
    fileCount.textContent = `(${state.files.length})`;

    if (state.files.length === 0) {
        filesList.innerHTML = '<div style="padding: 40px; text-align: center; color: var(--text-secondary);">No videos in queue</div>';
        return;
    }

    filesList.innerHTML = state.files.map((file, index) => `
        <div class="file-item" data-index="${index}">
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-details">
                    ${Math.round(file.info.video.width)}x${Math.round(file.info.video.height)} |
                    ${Math.round(file.info.video.fps)}fps |
                    ${formatDuration(file.info.duration)} |
                    ${formatSize(file.info.size)}
                </div>
                ${file.status === 'processing' ? `
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${file.progress}%"></div>
                    </div>
                ` : ''}
            </div>
            <div class="file-status ${file.status}">${formatStatus(file.status)}</div>
        </div>
    `).join('');
}

function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatSize(bytes) {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
}

function formatStatus(status) {
    const statusMap = {
        pending: 'Pending',
        processing: 'Processing...',
        completed: 'Completed',
        error: 'Error'
    };
    return statusMap[status] || status;
}

// Output directory
async function handleSelectOutputDir() {
    const result = await window.electronAPI.selectOutputDir();

    if (!result.canceled) {
        state.outputDir = result.path;
        outputDirInput.value = result.path;
        updateProcessButton();
    }
}

// Process videos
async function handleProcessVideos() {
    if (state.isProcessing) return;

    if (!state.outputDir) {
        alert('Please select an output directory');
        return;
    }

    state.isProcessing = true;
    processBtn.disabled = true;
    processBtn.textContent = 'Processing...';

    for (let i = 0; i < state.files.length; i++) {
        const file = state.files[i];

        if (file.status === 'completed') continue;

        file.status = 'processing';
        file.progress = 0;
        renderFilesList();

        const outputPath = `${state.outputDir}/${file.name.replace(/\.[^/.]+$/, '')}_tiktok_optimized.mp4`;

        const result = await window.electronAPI.processVideo({
            inputPath: file.path,
            outputPath: outputPath,
            preset: state.selectedPreset
        });

        if (result.success) {
            file.status = 'completed';
            file.progress = 100;
        } else {
            file.status = 'error';
            console.error('Processing error:', result.message);
        }

        renderFilesList();
    }

    state.isProcessing = false;
    processBtn.disabled = false;
    processBtn.textContent = 'Process Videos';

    alert('All videos processed!');
}

function updateFileProgress(data) {
    const file = state.files.find(f => f.path === data.filePath);

    if (file) {
        file.progress = Math.round(data.progress.percent || 0);
        renderFilesList();
    }
}

// Clear queue
function handleClearQueue() {
    if (state.isProcessing) {
        alert('Cannot clear queue while processing');
        return;
    }

    state.files = [];
    renderFilesList();
    updateProcessButton();
}

function updateProcessButton() {
    processBtn.disabled = state.files.length === 0 || !state.outputDir || state.isProcessing;
}

// Initialize on load
init();
