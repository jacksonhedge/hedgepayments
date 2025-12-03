import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import { addDeckViewer } from '@/app/utils/supabase';

// Initialize SendGrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
sgMail.setApiKey(SENDGRID_API_KEY);

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@hedgepayments.com';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Save to Supabase
    const dbResult = await addDeckViewer(email);
    if (dbResult.success) {
      console.log('Deck viewer saved to Supabase:', email, dbResult.isRepeatViewer ? '(repeat viewer)' : '(new viewer)');
    } else {
      console.log('Could not save to Supabase (continuing anyway):', dbResult.error);
    }

    // Send confirmation email to the investor
    const investorEmail = {
      to: email,
      from: {
        email: FROM_EMAIL,
        name: 'Jackson Fitzgerald'
      },
      subject: 'Thanks for viewing the Bankroll deck',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Georgia, 'Times New Roman', serif; line-height: 1.6; color: #2C2416; background-color: #FAF8F5; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .header { text-align: center; margin-bottom: 32px; }
            .logo { width: 80px; height: 80px; margin-bottom: 16px; }
            h1 { font-size: 32px; font-weight: normal; margin: 0 0 8px 0; }
            .divider { width: 60px; height: 1px; background-color: #D4C5B0; margin: 24px auto; }
            .content { color: #6B5D4F; }
            .content p { margin: 0 0 16px 0; }
            .highlight { background-color: #2C2416; color: #FAF8F5; padding: 24px; margin: 24px 0; }
            .highlight h3 { margin: 0 0 8px 0; font-weight: normal; color: #D4C5B0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
            .highlight p { margin: 0; color: #FAF8F5; font-size: 18px; }
            .cta { display: inline-block; padding: 14px 28px; background-color: #2C2416; color: #FAF8F5; text-decoration: none; margin-top: 16px; }
            .footer { margin-top: 40px; padding-top: 24px; border-top: 1px solid #D4C5B0; color: #8B7E6E; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Bankroll</h1>
              <p style="color: #6B5D4F; font-style: italic; margin: 0;">Fraternity Finances Made Easy</p>
            </div>

            <div class="divider"></div>

            <div class="content">
              <p>Thanks for taking a look at the Bankroll investor deck.</p>

              <p>We're building BNPL infrastructure for Greek life organizations — solving the $750M dues collection problem that treasurers and members face every semester.</p>

              <div class="highlight">
                <h3>The Opportunity</h3>
                <p>750K active members paying $1,000/year in dues, with 30-40% paying late. We make dues affordable with payment plans while chapters get paid upfront.</p>
              </div>

              <p>I'd love to chat if you're interested in learning more about our seed round.</p>

              <p>
                <a href="https://calendly.com/jacksonfitzgerald" class="cta" style="color: #FAF8F5;">Schedule a Call</a>
              </p>
            </div>

            <div class="footer">
              <p><strong>Jackson Fitzgerald</strong><br>
              Founder & CEO, Bankroll<br>
              jackson@hedgepayments.com</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Thanks for viewing the Bankroll deck!

We're building BNPL infrastructure for Greek life organizations — solving the $750M dues collection problem that treasurers and members face every semester.

750K active members paying $1,000/year in dues, with 30-40% paying late. We make dues affordable with payment plans while chapters get paid upfront.

I'd love to chat if you're interested in learning more about our seed round.

Jackson Fitzgerald
Founder & CEO, Bankroll
jackson@hedgepayments.com
      `
    };

    // Send notification to you
    const notificationEmail = {
      to: 'jackson@hedgepayments.com',
      from: {
        email: FROM_EMAIL,
        name: 'Bankroll Deck'
      },
      subject: `🎯 New deck viewer: ${email}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>New Investor Deck View</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <hr>
          <p>They've been sent a follow-up email automatically.</p>
        </div>
      `,
      text: `New deck viewer: ${email} at ${new Date().toLocaleString()}`
    };

    // Send both emails
    await Promise.all([
      sgMail.send(investorEmail),
      sgMail.send(notificationEmail)
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending deck access email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
