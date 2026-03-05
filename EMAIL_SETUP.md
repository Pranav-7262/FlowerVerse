# Email Configuration for Production

## Environment Variables Required

Add these to your production `.env` file:

```env
# Email Configuration (for password reset emails)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# For Gmail:
# 1. Enable 2-factor authentication
# 2. Generate an "App Password" in Google Account settings
# 3. Use the App Password (not your regular password) as EMAIL_PASS

# For other providers:
# EMAIL_HOST=smtp.mailgun.org  # or smtp.sendgrid.com, etc.
# EMAIL_PORT=587  # or 465 for SSL
# EMAIL_USER=your-smtp-username
# EMAIL_PASS=your-smtp-password

# Frontend URL (must match your production domain)
FRONTEND_URL=https://yourdomain.com
```

## Alternative Email Services

### 1. SendGrid

```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

### 2. Mailgun

```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=postmaster@yourdomain.mailgun.org
EMAIL_PASS=your-mailgun-password
```

### 3. AWS SES

```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=your-ses-smtp-username
EMAIL_PASS=your-ses-smtp-password
```

## Testing Email Configuration

You can test email sending with:

```bash
# Install maildev for local testing (optional)
npm install -g maildev
maildev

# Then use these settings for development:
EMAIL_HOST=localhost
EMAIL_PORT=1025
EMAIL_USER=
EMAIL_PASS=
```

## Security Notes

- Never commit email credentials to version control
- Use environment variables for all sensitive data
- Consider using services like SendGrid or Mailgun for production
- Always use HTTPS URLs in production (FRONTEND_URL)
- Reset tokens expire in 15 minutes for security
