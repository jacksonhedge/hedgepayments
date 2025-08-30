/**
 * Email template management for SendGrid
 * You can create these templates in SendGrid's Dynamic Templates editor
 * and reference them by ID here
 */

export const EMAIL_TEMPLATES = {
  // Waitlist welcome email
  WAITLIST_WELCOME: process.env.SENDGRID_TEMPLATE_WAITLIST_WELCOME || '',
  
  // Launch announcement
  LAUNCH_ANNOUNCEMENT: process.env.SENDGRID_TEMPLATE_LAUNCH || '',
  
  // Referral milestone reached
  REFERRAL_MILESTONE: process.env.SENDGRID_TEMPLATE_REFERRAL || '',
  
  // Weekly update
  WEEKLY_UPDATE: process.env.SENDGRID_TEMPLATE_WEEKLY || '',
} as const;

/**
 * SMS message templates
 */
export const SMS_TEMPLATES = {
  WAITLIST_WELCOME: (name: string) => 
    `Welcome to SideBet, ${name}! 🎰 You're on the waitlist. We'll text you when we launch. Reply STOP to unsubscribe.`,
  
  LAUNCH_ANNOUNCEMENT: () => 
    `🚀 SideBet is LIVE! Start turning your spare change into big wins. Login now: [link]`,
  
  REFERRAL_MILESTONE: (count: number) => 
    `🎉 You've referred ${count} friends to SideBet! You're moving up the waitlist. Keep sharing!`,
} as const;

/**
 * Example of using dynamic templates with SendGrid
 */
export function getWaitlistWelcomeData(user: {
  name: string;
  referralCode: string;
  selectedCasinos: string[];
}) {
  return {
    name: user.name,
    referral_code: user.referralCode,
    referral_link: `https://sidebet.com/?ref=${user.referralCode}`,
    selected_casinos: user.selectedCasinos.join(', '),
    casino_count: user.selectedCasinos.length,
    current_year: new Date().getFullYear(),
  };
}

/**
 * Example of using dynamic templates for launch announcement
 */
export function getLaunchAnnouncementData(user: {
  name: string;
  earlyAccessCode?: string;
}) {
  return {
    name: user.name,
    early_access_code: user.earlyAccessCode || '',
    has_early_access: !!user.earlyAccessCode,
    launch_date: new Date().toLocaleDateString(),
    signup_link: user.earlyAccessCode 
      ? `https://sidebet.com/signup?code=${user.earlyAccessCode}`
      : 'https://sidebet.com/signup',
  };
}