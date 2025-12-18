# Email Setup Instructions

The contact form is configured to send emails to **bavani.kannan@gmail.com** using the Resend email service.

## Setup Steps

### 1. Create a Resend Account

1. Go to [https://resend.com/signup](https://resend.com/signup)
2. Sign up for a free account (Free tier includes 100 emails/day)
3. Verify your email address

### 2. Get Your API Key

1. Log in to your Resend dashboard
2. Go to **API Keys** section
3. Click **Create API Key**
4. Give it a name (e.g., "Portfolio Contact Form")
5. Copy the API key (you'll only see it once!)

### 3. Configure Environment Variables

1. Create a file named `.env.local` in the root of your project
2. Add your API key:

```env
RESEND_API_KEY=re_your_actual_api_key_here
```

**Important:** Never commit `.env.local` to version control. It's already in `.gitignore`.

### 4. Verify Domain (Optional but Recommended)

For production use, you should verify your domain:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Follow the DNS verification steps
4. Once verified, update the `from` field in `/src/app/api/contact/route.js`:

```javascript
from: 'Portfolio Contact <contact@yourdomain.com>',
```

### 5. Test the Form

1. Start your development server: `npm run dev`
2. Navigate to the contact form
3. Fill in the form with test data
4. Submit and check bavani.kannan@gmail.com for the email

## Email Template Features

The email includes:
- ✅ Professional HTML design matching your portfolio theme
- ✅ Name, email, and message fields formatted clearly
- ✅ Timestamp of submission
- ✅ Reply-to set to the sender's email for easy responses
- ✅ Responsive design for mobile devices

## Troubleshooting

### Email not sending?

1. **Check API Key**: Make sure your `.env.local` file has the correct API key
2. **Restart Server**: After adding/changing `.env.local`, restart your dev server
3. **Check Console**: Look for error messages in your browser console or terminal
4. **Check Resend Dashboard**: Go to **Logs** to see delivery status

### Common Issues

- **"Failed to send email"**: API key is invalid or missing
- **"Invalid email address"**: The form email doesn't contain @
- **Rate limit errors**: Free tier has 100 emails/day limit

## Alternative Email Services

If you prefer a different service, you can modify `/src/app/api/contact/route.js`:

### Using Gmail with Nodemailer

```javascript
// Install: npm install nodemailer
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});
```

### Using SendGrid

```javascript
// Install: npm install @sendgrid/mail
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
```

## Security Notes

- ✅ Email validation is performed on both client and server
- ✅ API route validates all required fields
- ✅ Environment variables keep credentials secure
- ✅ CORS is handled by Next.js API routes
- ✅ Rate limiting should be added for production (consider using `next-rate-limit`)

## Support

For Resend support: [https://resend.com/docs](https://resend.com/docs)

