const crypto = require('crypto-js');

// Secret key for license generation (in production, keep this secure and server-side)
const SECRET_KEY = 'TMD_OPTI_2024_SECRET_KEY';

// Generate a license key based on email and expiry
function generateLicense(email, daysValid = 365) {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + daysValid);

  const data = {
    email: email.toLowerCase().trim(),
    expiry: expiryDate.toISOString(),
    generated: new Date().toISOString()
  };

  const dataString = JSON.stringify(data);
  const encrypted = crypto.AES.encrypt(dataString, SECRET_KEY).toString();

  // Format as a more readable license key (keep the encrypted string, just add dashes)
  const formatted = encrypted.match(/.{1,4}/g).join('-');

  return formatted;
}

// Validate a license key
function validateLicense(licenseKey) {
  try {
    if (!licenseKey || typeof licenseKey !== 'string') {
      return { valid: false, message: 'Invalid license format' };
    }

    // Remove dashes to get the encrypted string
    const encrypted = licenseKey.replace(/-/g, '');

    // Decrypt
    const decrypted = crypto.AES.decrypt(encrypted, SECRET_KEY);
    const dataString = decrypted.toString(crypto.enc.Utf8);

    if (!dataString) {
      return { valid: false, message: 'Invalid license key' };
    }

    const data = JSON.parse(dataString);

    // Check expiry
    const expiryDate = new Date(data.expiry);
    const now = new Date();

    if (now > expiryDate) {
      return {
        valid: false,
        message: 'License expired',
        expiry: data.expiry
      };
    }

    return {
      valid: true,
      message: 'License valid',
      email: data.email,
      expiry: data.expiry,
      daysRemaining: Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24))
    };
  } catch (error) {
    return {
      valid: false,
      message: 'Invalid license key format'
    };
  }
}

module.exports = {
  generateLicense,
  validateLicense
};
