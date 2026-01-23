const nodemailer = require('nodemailer');

/**
 * Email Service for TMD Opti 2FA
 * Sends verification codes via email
 */

// Email configuration
// IMPORTANT: For production, use environment variables or config file
const EMAIL_CONFIG = {
  // For demo/development: Use Gmail with app password
  // For production: Use SendGrid, AWS SES, or other email service
  service: 'gmail', // or 'SendGrid', 'AWS SES', etc.
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
};

// Create transporter
let transporter = null;

/**
 * Initialize email transporter
 * For demo mode, this returns null and codes are logged to console
 */
function initializeEmailService() {
  // Check if email credentials are configured
  if (EMAIL_CONFIG.auth.user === 'your-email@gmail.com' ||
      EMAIL_CONFIG.auth.pass === 'your-app-password') {
    console.log('⚠️  Email service not configured - running in DEMO mode');
    console.log('   Verification codes will be displayed in console');
    return null;
  }

  try {
    transporter = nodemailer.createTransport({
      service: EMAIL_CONFIG.service,
      auth: EMAIL_CONFIG.auth
    });

    console.log('✅ Email service initialized successfully');
    return transporter;
  } catch (error) {
    console.error('❌ Failed to initialize email service:', error.message);
    return null;
  }
}

/**
 * Send verification code via email
 * @param {string} email - Recipient email address
 * @param {string} code - 6-digit verification code
 * @returns {Promise<{success: boolean, message: string, code?: string}>}
 */
async function sendVerificationCode(email, code) {
  // Demo mode - just return the code
  if (!transporter) {
    console.log(`\n📧 [DEMO MODE] Verification code for ${email}: ${code}\n`);
    return {
      success: true,
      message: 'Demo mode - code displayed in console',
      code: code // Return code for demo display
    };
  }

  // Production mode - send actual email
  try {
    const mailOptions = {
      from: `"TMD Opti - 2FA Bot" <${EMAIL_CONFIG.auth.user}>`,
      to: email,
      subject: 'TMD Opti - Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              background-color: #0a0a0a;
              color: #ffffff;
              margin: 0;
              padding: 40px 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #1a1a1a;
              border-radius: 12px;
              padding: 40px;
              border: 1px solid #2a2a2a;
            }
            .logo {
              text-align: center;
              font-size: 32px;
              font-weight: 700;
              margin-bottom: 30px;
              color: #ffffff;
            }
            .title {
              font-size: 24px;
              font-weight: 600;
              margin-bottom: 20px;
              text-align: center;
            }
            .message {
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 30px;
              color: #808080;
              text-align: center;
            }
            .code-container {
              background-color: #252525;
              border: 2px solid #3a3a3a;
              border-radius: 8px;
              padding: 30px;
              text-align: center;
              margin-bottom: 30px;
            }
            .code {
              font-size: 48px;
              font-weight: 700;
              letter-spacing: 8px;
              color: #ffffff;
              font-family: 'Courier New', monospace;
            }
            .expiry {
              font-size: 14px;
              color: #808080;
              margin-top: 15px;
            }
            .footer {
              text-align: center;
              font-size: 14px;
              color: #4a4a4a;
              margin-top: 30px;
              padding-top: 30px;
              border-top: 1px solid #2a2a2a;
            }
            .warning {
              background-color: #2a1a1a;
              border: 1px solid #4a2a2a;
              border-radius: 6px;
              padding: 15px;
              margin-top: 20px;
              font-size: 14px;
              color: #ff6b6b;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">TMD Opti</div>

            <div class="title">🔐 Verification Code</div>

            <div class="message">
              You requested a demo license for TMD Opti. Enter the code below to generate your 1-day trial license.
            </div>

            <div class="code-container">
              <div class="code">${code}</div>
              <div class="expiry">⏱️ Expires in 5 minutes</div>
            </div>

            <div class="message">
              If you didn't request this code, you can safely ignore this email.
            </div>

            <div class="warning">
              ⚠️ Never share this code with anyone. TMD Opti staff will never ask for your verification code.
            </div>

            <div class="footer">
              <p>TMD Opti - Video Optimizer</p>
              <p>Need help? Join our Discord: discord.gg/GX2qBwQ3a9</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        TMD Opti - Verification Code

        Your verification code is: ${code}

        This code expires in 5 minutes.

        If you didn't request this code, you can safely ignore this email.

        Never share this code with anyone.

        Need help? Join our Discord: discord.gg/GX2qBwQ3a9
      `
    };

    await transporter.sendMail(mailOptions);

    console.log(`✅ Verification code sent to ${email}`);
    return {
      success: true,
      message: 'Verification code sent successfully'
    };
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    return {
      success: false,
      message: `Failed to send email: ${error.message}`
    };
  }
}

/**
 * Verify email service configuration
 * @returns {Promise<boolean>}
 */
async function verifyEmailConfig() {
  if (!transporter) {
    return false;
  }

  try {
    await transporter.verify();
    console.log('✅ Email service configuration verified');
    return true;
  } catch (error) {
    console.error('❌ Email service verification failed:', error.message);
    return false;
  }
}

// Initialize on module load
initializeEmailService();

module.exports = {
  sendVerificationCode,
  verifyEmailConfig,
  initializeEmailService,
  isDemoMode: () => !transporter
};
