import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    // Validate the data
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Email template
    const emailTemplate = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9f9f9;
    }
    .header {
      background: linear-gradient(135deg, #89BBDD 0%, #0d3a5c 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background: white;
      padding: 30px;
      border-radius: 0 0 8px 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .field {
      margin-bottom: 20px;
      padding: 15px;
      background-color: #f8f9fa;
      border-left: 4px solid #89BBDD;
      border-radius: 4px;
    }
    .label {
      font-weight: bold;
      color: #0d3a5c;
      display: block;
      margin-bottom: 5px;
      font-size: 14px;
      text-transform: uppercase;
    }
    .value {
      color: #333;
      font-size: 16px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #eee;
      color: #666;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">New Contact Form Submission</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Philip Portfolio Website</p>
    </div>
    <div class="content">
      <div class="field">
        <span class="label">Name</span>
        <span class="value">${name}</span>
      </div>
      <div class="field">
        <span class="label">Email</span>
        <span class="value">${email}</span>
      </div>
      <div class="field">
        <span class="label">Message</span>
        <div class="value" style="white-space: pre-wrap;">${message}</div>
      </div>
      <div class="footer">
        <p>This email was sent from your portfolio contact form</p>
        <p>Received on ${new Date().toLocaleString()}</p>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim();

    // Send email using Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: 'bavani.kannan@gmail.com',
        reply_to: email,
        subject: `New Contact Form Submission from ${name}`,
        html: emailTemplate,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend API error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json(
      { message: 'Email sent successfully', data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

