// TMD Opti - Wizard Interface
// Step-by-step video processing wizard with 2FA verification

let currentStep = 0;
let selectedMode = null;
let selectedPreset = null;
let selectedFiles = [];
let outputDirectory = null;

// License Modal Elements
const licenseModal = document.getElementById('licenseModal');
const mainApp = document.getElementById('mainApp');
const licenseInput = document.getElementById('licenseInput');
const validateBtn = document.getElementById('validateBtn');
const licenseMessage = document.getElementById('licenseMessage');
const buyLicenseBtn = document.getElementById('buyLicenseBtn');
const rememberMeCheckbox = document.getElementById('rememberMe');
const licenseInfoBox = document.getElementById('licenseInfo');
const licenseStatus = document.getElementById('licenseStatus');

// Demo License Modal Elements
const demoLicenseModal = document.getElementById('demoLicenseModal');
const showDemoLicenseBtn = document.getElementById('showDemoLicenseBtn');
const closeDemoModal = document.getElementById('closeDemoModal');
const demoModalOverlay = document.getElementById('demoModalOverlay');
const demoLicenseMessage = document.getElementById('demoLicenseMessage');

// 2FA Elements
const emailStep = document.getElementById('emailStep');
const codeStep = document.getElementById('codeStep');
const emailInput = document.getElementById('emailInput');
const sendCodeBtn = document.getElementById('sendCodeBtn');
const sentEmail = document.getElementById('sentEmail');
const displayCode = document.getElementById('displayCode');
const codeDisplay = document.getElementById('codeDisplay');
const codeInput = document.getElementById('codeInput');
const verifyCodeBtn = document.getElementById('verifyCodeBtn');
const resendCodeBtn = document.getElementById('resendCodeBtn');

// Step Indicators
const stepIndicators = document.querySelectorAll('.step');

// Step 1: Mode Selection
const modeCards = document.querySelectorAll('.mode-card');

// Step 2: File Selection
const dropZone = document.getElementById('dropZone');
const browseBtn = document.getElementById('browseBtn');
const filesList = document.getElementById('filesList');
const backToMode = document.getElementById('backToMode');
const continueToSettings = document.getElementById('continueToSettings');

// Step 3: Settings (Quality Enhancement)
const qualityPresets = document.querySelectorAll('#step3-quality .preset-card');
const outputDirQuality = document.getElementById('outputDirQuality');
const selectDirQuality = document.getElementById('selectDirQuality');
const backToFiles1 = document.getElementById('backToFiles1');
const continueToProcess1 = document.getElementById('continueToProcess1');

// Step 3: Settings (Resolution Optimizer)
const resolutionPresets = document.querySelectorAll('#step3-resolution .preset-card');
const outputDirResolution = document.getElementById('outputDirResolution');
const selectDirResolution = document.getElementById('selectDirResolution');
const backToFiles2 = document.getElementById('backToFiles2');
const continueToProcess2 = document.getElementById('continueToProcess2');

// Step 4: Processing
const processingMode = document.getElementById('processingMode');
const processingPreset = document.getElementById('processingPreset');
const processingCount = document.getElementById('processingCount');
const processingList = document.getElementById('processingList');
const cancelProcessing = document.getElementById('cancelProcessing');
const finishProcessing = document.getElementById('finishProcessing');

// ===== LICENSE MODAL =====

// Check for stored license on startup
window.addEventListener('DOMContentLoaded', async () => {
    const result = await window.electronAPI.checkStoredLicense();

    if (result.valid && result.remembered) {
        // Auto-login successful - show license info
        displayLicenseInfo(result);
        showMessage('License loaded successfully', 'success');

        setTimeout(() => {
            licenseModal.classList.add('hidden');
            mainApp.classList.remove('hidden');
            updateHeaderLicenseStatus(result);
            showStep(1);
        }, 1500);
    } else {
        // Show login modal
        if (result.message) {
            showMessage(result.message, 'info');
        }
    }
});

// Validate license key
validateBtn.addEventListener('click', async () => {
    const licenseKey = licenseInput.value.trim();
    const rememberMe = rememberMeCheckbox.checked;

    if (!licenseKey) {
        showMessage('Please enter a license key', 'error');
        return;
    }

    validateBtn.disabled = true;
    validateBtn.textContent = 'Validating...';

    const result = await window.electronAPI.validateLicense(licenseKey, rememberMe);

    validateBtn.disabled = false;
    validateBtn.textContent = 'Activate License';

    if (result.valid) {
        displayLicenseInfo(result, rememberMe);
        showMessage('License activated successfully!', 'success');

        setTimeout(() => {
            licenseModal.classList.add('hidden');
            mainApp.classList.remove('hidden');
            updateHeaderLicenseStatus(result, rememberMe);
            showStep(1);
        }, 1500);
    } else {
        showMessage(result.message || 'Invalid license key', 'error');
    }
});

// Buy license button
buyLicenseBtn.addEventListener('click', () => {
    window.electronAPI.openExternal('https://discord.gg/GX2qBwQ3a9');
});

// ===== DEMO LICENSE MODAL =====

// Show demo license modal
if (showDemoLicenseBtn) {
    showDemoLicenseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Demo license button clicked');
        if (demoLicenseModal) {
            demoLicenseModal.classList.remove('hidden');
            // Reset form
            if (emailStep) emailStep.classList.remove('hidden');
            if (codeStep) codeStep.classList.add('hidden');
            if (emailInput) emailInput.value = '';
            if (codeInput) codeInput.value = '';
            if (demoLicenseMessage) demoLicenseMessage.style.display = 'none';
        }
    });
}

// Close demo license modal
if (closeDemoModal) {
    closeDemoModal.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (demoLicenseModal) {
            demoLicenseModal.classList.add('hidden');
        }
    });
}

// Close on overlay click
if (demoModalOverlay) {
    demoModalOverlay.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (demoLicenseModal) {
            demoLicenseModal.classList.add('hidden');
        }
    });
}

// ===== 2FA DEMO LICENSE =====

// Send verification code
sendCodeBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();

    if (!email || !email.includes('@')) {
        showDemoMessage('Please enter a valid email address', 'error');
        return;
    }

    sendCodeBtn.disabled = true;
    sendCodeBtn.textContent = 'Sending...';

    const result = await window.electronAPI.sendVerificationCode(email);

    sendCodeBtn.disabled = false;
    sendCodeBtn.textContent = 'Send Verification Code';

    if (result.success) {
        // Show code step, hide email step
        emailStep.classList.add('hidden');
        codeStep.classList.remove('hidden');
        sentEmail.textContent = email;

        // Only display code if returned (demo mode)
        if (result.code) {
            displayCode.textContent = result.code;
            codeDisplay.style.display = 'block';
        } else {
            codeDisplay.style.display = 'none';
        }

        showDemoMessage('Verification code sent! Check your email.', 'success');
    } else {
        showDemoMessage(result.message || 'Failed to send code', 'error');
    }
});

// Verify code and generate license
verifyCodeBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    const code = codeInput.value.trim();

    if (!code || code.length !== 6) {
        showDemoMessage('Please enter the 6-digit code', 'error');
        return;
    }

    verifyCodeBtn.disabled = true;
    verifyCodeBtn.textContent = 'Verifying...';

    const result = await window.electronAPI.verifyAndGenerateLicense(email, code, 1);

    verifyCodeBtn.disabled = false;
    verifyCodeBtn.textContent = 'Verify & Generate License';

    if (result.success) {
        showDemoMessage('Demo license generated!', 'success');
        licenseInput.value = result.license;

        // Close modal and reset 2FA flow
        setTimeout(() => {
            demoLicenseModal.classList.add('hidden');
            emailStep.classList.remove('hidden');
            codeStep.classList.add('hidden');
            emailInput.value = '';
            codeInput.value = '';
            showMessage('Demo license copied to license field. Click "Activate License" to continue.', 'success');
        }, 1500);
    } else {
        showDemoMessage(result.message || 'Verification failed', 'error');
    }
});

// Resend code
resendCodeBtn.addEventListener('click', () => {
    codeStep.classList.add('hidden');
    emailStep.classList.remove('hidden');
    codeInput.value = '';
    showDemoMessage('Enter your email to resend code', 'info');
});

// ===== WIZARD STEPS =====

function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));

    // Update step indicators
    stepIndicators.forEach((indicator, index) => {
        indicator.classList.remove('active', 'completed');
        if (index + 1 < step) {
            indicator.classList.add('completed');
        } else if (index + 1 === step) {
            indicator.classList.add('active');
        }
    });

    // Show current step
    if (step === 1) {
        document.getElementById('step1').classList.add('active');
    } else if (step === 2) {
        document.getElementById('step2').classList.add('active');
    } else if (step === 3) {
        if (selectedMode === 'quality') {
            document.getElementById('step3-quality').classList.add('active');
        } else {
            document.getElementById('step3-resolution').classList.add('active');
        }
    } else if (step === 4) {
        document.getElementById('step4').classList.add('active');
    }

    currentStep = step;
}

// ===== STEP 1: MODE SELECTION =====

modeCards.forEach(card => {
    const selectBtn = card.querySelector('.select-mode-btn');

    selectBtn.addEventListener('click', () => {
        selectedMode = card.dataset.mode;
        showStep(2);
    });
});

// ===== STEP 2: FILE SELECTION =====

// Browse button
browseBtn.addEventListener('click', async () => {
    const result = await window.electronAPI.selectFiles();

    if (!result.canceled && result.filePaths.length > 0) {
        await addFiles(result.filePaths);
    }
});

// Drag and drop
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', async (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');

    const files = Array.from(e.dataTransfer.files);
    const filePaths = files.map(f => f.path);

    await addFiles(filePaths);
});

// Add files to list
async function addFiles(filePaths) {
    for (const filePath of filePaths) {
        // Check if already added
        if (selectedFiles.find(f => f.path === filePath)) {
            continue;
        }

        // Get video info
        const infoResult = await window.electronAPI.getVideoInfo(filePath);

        if (!infoResult.success) {
            console.error('Failed to get video info:', infoResult.message);
            continue;
        }

        const info = infoResult.info;
        const fileName = filePath.split('/').pop();

        selectedFiles.push({
            path: filePath,
            name: fileName,
            info: info
        });

        // Add to UI
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-info">
                <div class="file-name">${fileName}</div>
                <div class="file-details">${info.width}×${info.height} • ${info.duration}s • ${info.size}</div>
            </div>
            <button class="btn-remove" onclick="removeFile('${filePath}')">Remove</button>
        `;

        filesList.appendChild(fileItem);
    }

    // Enable continue button if files added
    continueToSettings.disabled = selectedFiles.length === 0;
}

// Remove file from list
window.removeFile = (filePath) => {
    selectedFiles = selectedFiles.filter(f => f.path !== filePath);

    // Update UI
    filesList.innerHTML = '';
    selectedFiles.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-details">${file.info.width}×${file.info.height} • ${file.info.duration}s • ${file.info.size}</div>
            </div>
            <button class="btn-remove" onclick="removeFile('${file.path}')">Remove</button>
        `;
        filesList.appendChild(fileItem);
    });

    continueToSettings.disabled = selectedFiles.length === 0;
};

// Navigation buttons
backToMode.addEventListener('click', () => {
    showStep(1);
});

continueToSettings.addEventListener('click', () => {
    showStep(3);
});

// ===== STEP 3: SETTINGS (QUALITY ENHANCEMENT) =====

qualityPresets.forEach(card => {
    card.addEventListener('click', () => {
        qualityPresets.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedPreset = card.dataset.preset;
    });
});

selectDirQuality.addEventListener('click', async () => {
    const result = await window.electronAPI.selectOutputDir();

    if (!result.canceled) {
        outputDirectory = result.path;
        outputDirQuality.value = result.path;
    }
});

backToFiles1.addEventListener('click', () => {
    showStep(2);
});

continueToProcess1.addEventListener('click', () => {
    if (!selectedPreset) {
        showMessage('Please select a quality preset', 'error');
        return;
    }

    if (!outputDirectory) {
        showMessage('Please select output directory', 'error');
        return;
    }

    startProcessing();
});

// ===== STEP 3: SETTINGS (RESOLUTION OPTIMIZER) =====

resolutionPresets.forEach(card => {
    card.addEventListener('click', () => {
        resolutionPresets.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedPreset = card.dataset.preset;
    });
});

selectDirResolution.addEventListener('click', async () => {
    const result = await window.electronAPI.selectOutputDir();

    if (!result.canceled) {
        outputDirectory = result.path;
        outputDirResolution.value = result.path;
    }
});

backToFiles2.addEventListener('click', () => {
    showStep(2);
});

continueToProcess2.addEventListener('click', () => {
    if (!selectedPreset) {
        showMessage('Please select a preset', 'error');
        return;
    }

    if (!outputDirectory) {
        showMessage('Please select output directory', 'error');
        return;
    }

    startProcessing();
});

// ===== STEP 4: PROCESSING =====

async function startProcessing() {
    showStep(4);

    // Update summary
    processingMode.textContent = selectedMode === 'quality' ? 'Quality Enhancement' : 'Resolution Optimizer';
    processingPreset.textContent = selectedPreset.charAt(0).toUpperCase() + selectedPreset.slice(1);
    processingCount.textContent = selectedFiles.length;

    // Clear previous processing items
    processingList.innerHTML = '';

    // Process each file
    for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];

        // Add processing item
        const item = document.createElement('div');
        item.className = 'processing-item';
        item.id = `processing-${i}`;
        item.innerHTML = `
            <div class="processing-file-info">
                <div class="processing-file-name">${file.name}</div>
                <div class="processing-status">Starting...</div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
            </div>
        `;

        processingList.appendChild(item);

        // Process video
        try {
            const result = await window.electronAPI.processVideo({
                inputPath: file.path,
                outputDir: outputDirectory,
                mode: selectedMode,
                preset: selectedPreset
            });

            if (result.success) {
                updateProcessingItem(i, 100, 'Completed ✓');
            } else {
                updateProcessingItem(i, 0, 'Failed ✗');
            }
        } catch (error) {
            updateProcessingItem(i, 0, 'Error ✗');
        }
    }

    // Show finish button
    cancelProcessing.classList.add('hidden');
    finishProcessing.classList.remove('hidden');
}

// Listen for progress updates
window.electronAPI.onProcessingProgress((data) => {
    const index = selectedFiles.findIndex(f => f.path === data.filePath);
    if (index !== -1) {
        updateProcessingItem(index, data.progress, 'Processing...');
    }
});

function updateProcessingItem(index, progress, status) {
    const item = document.getElementById(`processing-${index}`);
    if (!item) return;

    const statusEl = item.querySelector('.processing-status');
    const progressFill = item.querySelector('.progress-fill');

    statusEl.textContent = status;
    progressFill.style.width = `${progress}%`;
}

// Cancel processing
cancelProcessing.addEventListener('click', () => {
    // Reset and go back to step 1
    selectedFiles = [];
    selectedMode = null;
    selectedPreset = null;
    outputDirectory = null;
    filesList.innerHTML = '';
    showStep(1);
});

// Finish processing
finishProcessing.addEventListener('click', () => {
    // Reset and go back to step 1
    selectedFiles = [];
    selectedMode = null;
    selectedPreset = null;
    outputDirectory = null;
    filesList.innerHTML = '';
    continueToSettings.disabled = true;
    finishProcessing.classList.add('hidden');
    cancelProcessing.classList.remove('hidden');
    showStep(1);
});

// ===== UTILITY FUNCTIONS =====

function showMessage(message, type = 'info') {
    licenseMessage.textContent = message;
    licenseMessage.className = `message ${type}`;
    licenseMessage.style.display = 'block';

    setTimeout(() => {
        licenseMessage.style.display = 'none';
    }, 5000);
}

function showDemoMessage(message, type = 'info') {
    demoLicenseMessage.textContent = message;
    demoLicenseMessage.className = `message ${type}`;
    demoLicenseMessage.style.display = 'block';

    setTimeout(() => {
        demoLicenseMessage.style.display = 'none';
    }, 5000);
}

// Display license information
function displayLicenseInfo(result, rememberMe = false) {
    if (!result.valid) return;

    // Calculate remaining time
    const expiryDate = new Date(result.expiry);
    const now = new Date();
    const daysRemaining = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

    let html = '<div class="license-info-item">';
    html += '<span class="license-info-label">License expires:</span>';

    if (daysRemaining > 7) {
        html += `<span class="license-info-value">${expiryDate.toLocaleDateString()} (${daysRemaining} days)</span>`;
    } else if (daysRemaining > 0) {
        html += `<span class="license-info-value expiring">${expiryDate.toLocaleDateString()} (${daysRemaining} days)</span>`;
    } else {
        html += `<span class="license-info-value expired">Expired</span>`;
    }
    html += '</div>';

    // Show remember period if applicable
    if (rememberMe || result.remembered) {
        const rememberText = result.rememberExpiresIn || '3 days';
        html += '<div class="license-info-item">';
        html += '<span class="license-info-label">Remember me expires:</span>';
        html += `<span class="license-info-value">${rememberText}</span>`;
        html += '</div>';
    }

    licenseInfoBox.innerHTML = html;
    licenseInfoBox.classList.remove('hidden');
}

// Update header license status
function updateHeaderLicenseStatus(result, rememberMe = false) {
    if (!licenseStatus) return;

    const expiryDate = new Date(result.expiry);
    const now = new Date();
    const daysRemaining = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

    let statusText = '';
    if (daysRemaining > 7) {
        statusText = `License: ${daysRemaining} days remaining`;
    } else if (daysRemaining > 0) {
        statusText = `⚠️ License expires in ${daysRemaining} days`;
    } else {
        statusText = `❌ License expired`;
    }

    // Add remember info if active
    if (rememberMe || result.remembered) {
        const rememberText = result.rememberExpiresIn || '3 days';
        statusText += ` • Auto-login: ${rememberText}`;
    }

    licenseStatus.textContent = statusText;
}
