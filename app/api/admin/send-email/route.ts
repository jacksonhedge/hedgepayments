import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { notifyWaitlistUsers, sendWaitlistSMS } from '../../../../lib/emailService';
import { sendEmail } from '../../../../lib/sendgrid';
import { EMAIL_TEMPLATES, SMS_TEMPLATES, getLaunchAnnouncementData } from '../../../utils/emailTemplates';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Simple auth check - in production, use proper authentication
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'your-admin-secret';

export async function POST(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || authHeader !== `Bearer ${ADMIN_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      type, // 'email' or 'sms'
      target, // 'all', 'test', or specific email
      subject,
      message,
      templateId,
      templateData
    } = body;

    // Validate required fields
    if (!type || !target) {
      return NextResponse.json(
        { error: 'Type and target are required' },
        { status: 400 }
      );
    }

    let recipients: string[] = [];
    let recipientData: any[] = [];

    // Get recipients based on target
    if (target === 'all') {
      const { data: waitlistUsers, error } = await supabase
        .from('waitlist')
        .select('email, own_referral_code, sportsbooks');
      
      if (error) throw error;
      
      recipients = waitlistUsers?.map(u => u.email) || [];
      recipientData = waitlistUsers || [];
    } else if (target === 'test') {
      // Send test email to admin
      recipients = [process.env.SENDGRID_FROM_EMAIL || 'admin@hedgepayments.com'];
      recipientData = [{
        email: recipients[0],
        own_referral_code: 'TEST123',
        sportsbooks: ['DraftKings', 'FanDuel']
      }];
    } else {
      // Send to specific email
      recipients = [target];
      const { data: user } = await supabase
        .from('waitlist')
        .select('email, own_referral_code, sportsbooks')
        .eq('email', target)
        .single();
      
      recipientData = user ? [user] : [{
        email: target,
        own_referral_code: 'DIRECT',
        sportsbooks: []
      }];
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: 'No recipients found' },
        { status: 404 }
      );
    }

    let successCount = 0;
    let failureCount = 0;

    if (type === 'email') {
      if (templateId) {
        // Send using SendGrid template
        for (const user of recipientData) {
          try {
            const success = await sendEmail({
              to: user.email,
              subject: subject || 'Update from SideBet',
              templateId,
              dynamicTemplateData: templateData || getLaunchAnnouncementData({
                name: user.email.split('@')[0],
                earlyAccessCode: user.own_referral_code
              })
            });
            
            if (success) successCount++;
            else failureCount++;
          } catch (error) {
            console.error(`Failed to send to ${user.email}:`, error);
            failureCount++;
          }
        }
      } else {
        // Send plain email
        const success = await notifyWaitlistUsers(
          subject || 'Update from SideBet',
          message || 'We have exciting news to share!',
          recipients
        );
        
        if (success) successCount = recipients.length;
        else failureCount = recipients.length;
      }
    } else if (type === 'sms') {
      // SMS sending would require phone numbers in the database
      // This is a placeholder for SMS functionality
      return NextResponse.json(
        { error: 'SMS functionality requires phone numbers in the database' },
        { status: 501 }
      );
    }

    return NextResponse.json({
      success: true,
      summary: {
        total: recipients.length,
        successful: successCount,
        failed: failureCount
      }
    });

  } catch (error: any) {
    console.error('Error in send-email route:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve email statistics
export async function GET(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || authHeader !== `Bearer ${ADMIN_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get waitlist statistics
    const { count: totalCount } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true });

    // Get recent signups (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { count: recentCount } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString());

    return NextResponse.json({
      stats: {
        total_subscribers: totalCount || 0,
        recent_signups: recentCount || 0,
        email_templates: Object.keys(EMAIL_TEMPLATES),
        sms_templates: Object.keys(SMS_TEMPLATES)
      }
    });

  } catch (error: any) {
    console.error('Error getting email stats:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    );
  }
}