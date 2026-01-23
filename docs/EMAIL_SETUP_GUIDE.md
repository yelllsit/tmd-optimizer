# Email Service Setup Guide - TMD Opti 2FA

This guide explains how to set up email sending for the 2FA verification system in TMD Opti.

---

## Current Status

**Demo Mode**: The app currently runs in DEMO mode, which means:
- ✅ Verification codes are generated
- ✅ Codes are displayed in the console
- ✅ Codes are shown in the UI (for testing)
- ❌ No actual emails are sent

**Production Mode**: To send actual emails, you need to configure SMTP credentials.

---

## Quick Setup (Gmail - Recommended for Testing)

### Step 1: Enable 2-Step Verification on Gmail

1. Go to https://myaccount.google.com/security
2. Find "2-Step Verification"
3. Click "Get started" and follow the prompts
4. Complete 2-Step Verification setup

### Step 2: Generate App Password

1. After enabling 2-Step Verification, go back to https://myaccount.google.com/security
2. Find "App passwords" (under 2-Step Verification section)
3. Click "App passwords"
4. Select:
   - App: "Mail"
   - Device: "Other (Custom name)" → Enter "TMD Opti"
5. Click "Generate"
6. **Copy the 16-character password** (you'll need this)

### Step 3: Configure TMD Opti

**Method 1: Environment Variables (Recommended)**

Create a `.env` file in the project root:

```bash
# /Users/khayel/tiktok-video-optimizer/.env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

Update `package.json` to load environment variables:

```json
{
  "scripts": {
    "start": "electron .",
    "start:prod": "NODE_ENV=production electron ."
  }
}
```

Then install dotenv:

```bash
npm install dotenv
```

Add to top of `src/main.js`:

```javascript
require('dotenv').config();
```

**Method 2: Direct Configuration (For Testing Only)**

Edit `src/emailService.js`:

```javascript
const EMAIL_CONFIG = {
  service: 'gmail',
  auth: {
    user: 'your-actual-email@gmail.com',  // Replace this
    pass: 'your-actual-app-password'       // Replace this
  }
};
```

⚠️ **Warning**: Never commit this file with real credentials to Git!

### Step 4: Test Email Service

1. Start the app:
   ```bash
   npm start
   ```

2. Check the console for:
   ```
   ✅ Email service initialized successfully
   ```

3. Try generating a demo license with an email you can access

4. You should receive an email with the verification code

---

## Production Setup Options

### Option 1: SendGrid (Recommended for Production)

**Why SendGrid?**
- ✅ Free tier: 100 emails/day
- ✅ Professional email delivery
- ✅ Better deliverability than Gmail
- ✅ Detailed analytics

**Setup:**

1. **Sign up for SendGrid:**
   - Go to https://sendgrid.com
   - Create free account
   - Verify your email

2. **Create API Key:**
   - Go to Settings → API Keys
   - Click "Create API Key"
   - Name: "TMD Opti"
   - Permissions: "Full Access"
   - Copy the API key

3. **Install SendGrid package:**
   ```bash
   npm install @sendgrid/mail
   ```

4. **Update `src/emailService.js`:**
   ```javascript
   const sgMail = require('@sendgrid/mail');
   sgMail.setApiKey(process.env.SENDGRID_API_KEY);

   async function sendVerificationCode(email, code) {
     const msg = {
       to: email,
       from: 'noreply@yourdomain.com', // Must be verified in SendGrid
       subject: 'TMD Opti - Verification Code',
       html: `... your HTML template ...`
     };

     try {
       await sgMail.send(msg);
       return { success: true, message: 'Code sent successfully' };
     } catch (error) {
       return { success: false, message: error.message };
     }
   }
   ```

5. **Set environment variable:**
   ```bash
   # .env
   SENDGRID_API_KEY=SG.your_api_key_here
   EMAIL_USER=noreply@yourdomain.com
   ```

### Option 2: AWS SES (Amazon Simple Email Service)

**Why AWS SES?**
- ✅ Very cheap (€0.10 per 1,000 emails)
- ✅ High deliverability
- ✅ Scalable

**Setup:**

1. **Sign up for AWS:**
   - Go to https://aws.amazon.com
   - Create account (requires credit card)

2. **Set up SES:**
   - Go to SES Dashboard
   - Verify your domain or email
   - Create SMTP credentials

3. **Install AWS SDK:**
   ```bash
   npm install @aws-sdk/client-ses
   ```

4. **Configure:**
   ```bash
   # .env
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   EMAIL_USER=noreply@yourdomain.com
   ```

### Option 3: Custom SMTP Server

**For advanced users with existing email hosting:**

```javascript
// src/emailService.js
const EMAIL_CONFIG = {
  host: 'smtp.yourdomain.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
};
```

---

## Security Best Practices

### 1. Use Environment Variables

**Never hardcode credentials!**

✅ Good:
```javascript
user: process.env.EMAIL_USER,
pass: process.env.EMAIL_PASSWORD
```

❌ Bad:
```javascript
user: 'myemail@gmail.com',
pass: 'mypassword123'
```

### 2. Add .env to .gitignore

Create/update `.gitignore`:

```
# Environment variables
.env
.env.local
.env.production

# Logs
*.log

# Dependencies
node_modules/
```

### 3. Use App Passwords (Gmail)

**Never use your actual Gmail password!**

Always use app-specific passwords generated from Google Account settings.

### 4. Rate Limiting

Consider adding rate limiting to prevent abuse:

```javascript
// src/main.js
const rateLimiter = new Map();

ipcMain.handle('send-verification-code', async (event, email) => {
  // Check rate limit (max 3 codes per hour per email)
  const now = Date.now();
  const limit = rateLimiter.get(email) || { count: 0, resetTime: now + 3600000 };

  if (now > limit.resetTime) {
    limit.count = 0;
    limit.resetTime = now + 3600000;
  }

  if (limit.count >= 3) {
    return {
      success: false,
      message: 'Too many attempts. Please try again in an hour.'
    };
  }

  limit.count++;
  rateLimiter.set(email, limit);

  // ... rest of code
});
```

---

## Troubleshooting

### Error: "Invalid login: 535-5.7.8 Username and Password not accepted"

**Problem**: Gmail app password incorrect or 2-Step Verification not enabled

**Solution**:
1. Verify 2-Step Verification is enabled
2. Generate new app password
3. Copy password exactly (no spaces)
4. Update .env file

### Error: "self signed certificate in certificate chain"

**Problem**: Node.js SSL certificate issue

**Solution**:
```javascript
// Add to emailService.js (temporary fix for development)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { ... },
  tls: {
    rejectUnauthorized: false
  }
});
```

⚠️ Only use this for development!

### Error: "Greeting never received"

**Problem**: SMTP connection blocked by firewall/ISP

**Solution**:
1. Try different port (587 instead of 465)
2. Check firewall settings
3. Try different network
4. Use SendGrid or AWS SES instead

### Emails Going to Spam

**Problem**: Email deliverability issues

**Solution**:
1. Use professional email service (SendGrid/AWS SES)
2. Verify your domain with SPF/DKIM records
3. Use "no-reply" or "noreply" sender address
4. Avoid spam trigger words in subject/body

---

## Testing Email Service

### Test Script

Create `test-email.js`:

```javascript
require('dotenv').config();
const { sendVerificationCode } = require('./src/emailService');

async function test() {
  const email = 'your-test-email@gmail.com';
  const code = '123456';

  console.log('Sending test email...');
  const result = await sendVerificationCode(email, code);

  if (result.success) {
    console.log('✅ Email sent successfully!');
  } else {
    console.log('❌ Failed:', result.message);
  }
}

test();
```

Run:
```bash
node test-email.js
```

---

## Email Templates

The current email template is styled to match TMD Opti's dark theme.

### Customization

Edit `src/emailService.js` → `mailOptions.html`:

- **Change colors**: Update hex codes (#0a0a0a, #1a1a1a, etc.)
- **Add logo**: Include `<img src="cid:logo">` and attach image
- **Change layout**: Modify HTML structure
- **Update footer**: Change Discord link or add website

### Preview Template

Use https://htmlemail.io/inline/ to test your HTML email template.

---

## Production Checklist

Before deploying to production:

- [ ] Email service configured (Gmail/SendGrid/AWS SES)
- [ ] Environment variables set up
- [ ] .env file added to .gitignore
- [ ] Credentials never committed to Git
- [ ] Email template tested and looks good
- [ ] Verification codes sending successfully
- [ ] Emails not going to spam
- [ ] Rate limiting implemented
- [ ] Error handling in place
- [ ] Console logs appropriate for production

---

## Cost Comparison

| Service | Free Tier | Cost After Free | Best For |
|---------|-----------|-----------------|----------|
| **Gmail** | Unlimited | Free | Testing only |
| **SendGrid** | 100/day | $15/month (40k) | Small apps |
| **AWS SES** | 62k/month | $0.10/1000 | High volume |
| **Mailgun** | 5k/month | $35/month (50k) | Medium apps |

**Recommendation**:
- Development: Gmail
- Production (small): SendGrid free tier
- Production (large): AWS SES

---

## Support

**Need help setting up email?**

1. Check console logs for specific errors
2. Review this guide's troubleshooting section
3. Test with Gmail first (simplest setup)
4. Join Discord for help: https://discord.gg/GX2qBwQ3a9

---

## Summary

**Current Setup**: Demo mode (codes displayed, not emailed)

**To Enable Emails**:
1. Choose email provider (Gmail for testing, SendGrid for production)
2. Get credentials (App password for Gmail, API key for SendGrid)
3. Set environment variables in .env file
4. Restart application
5. Test with your own email

**Files to Configure**:
- `.env` - Email credentials (create this file)
- `src/emailService.js` - Already configured (just needs credentials)
- `src/main.js` - Already integrated

Once configured, verification codes will be sent via email instead of being displayed!

---

🎉 **Ready to go live with real 2FA emails!** 🎉
