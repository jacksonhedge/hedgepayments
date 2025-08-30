// emailService.ts
// This file contains email notification functionality for the waitlist

import { sendEmail, sendBulkEmail, addToContactList, sendSMS } from './sendgrid';

type WaitlistUser = {
  name: string;
  email: string;
  state: string;
  selectedCasinos: string[];
  referralCode: string;
}

/**
 * Function to send a confirmation email to a user who joined the waitlist
 * 
 * @param user The user who joined the waitlist
 * @returns Promise<boolean> Success status of the email sending operation
 */
export async function sendWaitlistConfirmation(user: WaitlistUser): Promise<boolean> {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1a1a1a; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f4f4f4; }
          .button { display: inline-block; padding: 12px 24px; background-color: #ff6b6b; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to SideBet!</h1>
          </div>
          <div class="content">
            <h2>Hey ${user.name}! 🎰</h2>
            <p>Thank you for joining the SideBet waitlist! We're thrilled to have you as part of our exclusive community.</p>
            <p>You're now on the list to be among the first to experience SideBet when we launch. We'll notify you as soon as we're ready!</p>
            <h3>What's SideBet?</h3>
            <p>With SideBet, you can round up your spare change from everyday purchases and put it towards your favorite casino games. Every 10¢ could win you thousands!</p>
            <h3>Your Selected Casinos:</h3>
            <ul>
              ${user.selectedCasinos.map(casino => `<li>${casino}</li>`).join('')}
            </ul>
            ${user.referralCode ? `
            <h3>Your Referral Code: <strong>${user.referralCode}</strong></h3>
            <p>Share this code with friends to move up the waitlist!</p>
            ` : ''}
          </div>
          <div class="footer">
            <p>&copy; 2025 SideBet. All rights reserved.</p>
            <p>You're receiving this email because you signed up for the SideBet waitlist.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Hey ${user.name}!
      
      Thank you for joining the SideBet waitlist! We're thrilled to have you as part of our exclusive community.
      
      You're now on the list to be among the first to experience SideBet when we launch.
      
      With SideBet, you can round up your spare change from everyday purchases and put it towards your favorite casino games.
      
      Your selected casinos: ${user.selectedCasinos.join(', ')}
      ${user.referralCode ? `Your referral code: ${user.referralCode}` : ''}
      
      Stay tuned!
      The SideBet Team
    `;

    return await sendEmail({
      to: user.email,
      subject: 'Welcome to the SideBet Waitlist! 🎰',
      text: text.trim(),
      html
    });
  } catch (error) {
    console.error('Error sending waitlist confirmation email:', error);
    return false;
  }
}

/**
 * Function to subscribe user to the waitlist newsletter
 * 
 * @param user The user to add to the newsletter
 * @returns Promise<boolean> Success status
 */
export async function subscribeToWaitlist(user: WaitlistUser): Promise<boolean> {
  // In a production environment, you would add the user to a database and/or a mailing list service
  
  // Mock implementation
  try {
    console.log(`
      MOCK WAITLIST DATABASE:
      ---------------------
      Added new user to waitlist:
      Name: ${user.name}
      Email: ${user.email}
      State: ${user.state}
      Selected Casinos: ${user.selectedCasinos.join(', ')}
      Referral Code: ${user.referralCode || 'None'}
      Timestamp: ${new Date().toISOString()}
    `);
    
    // Send confirmation email
    await sendWaitlistConfirmation(user);
    
    return true;
  } catch (error) {
    console.error('Error adding user to waitlist:', error);
    return false;
  }
}

/**
 * Function to notify all users on the waitlist about updates
 * 
 * @param subject The email subject
 * @param message The email message
 * @param recipients Array of email addresses
 * @returns Promise<boolean> Success status
 */
export async function notifyWaitlistUsers(subject: string, message: string, recipients: string[]): Promise<boolean> {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1a1a1a; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f4f4f4; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SideBet Update</h1>
          </div>
          <div class="content">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <div class="footer">
            <p>&copy; 2025 SideBet. All rights reserved.</p>
            <p>You're receiving this email because you're on the SideBet waitlist.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await sendBulkEmail(recipients, {
      subject,
      text: message,
      html
    });
  } catch (error) {
    console.error('Error sending bulk notification:', error);
    return false;
  }
}

/**
 * Get the current waitlist count
 * In a real application, this would query your database
 * 
 * @returns Promise<number> The number of users on the waitlist
 */
export async function getWaitlistCount(): Promise<number> {
  // In a production environment, this would query your database
  
  // Mock implementation with random number between 500-600
  return Promise.resolve(Math.floor(Math.random() * 100) + 500);
}

/**
 * Send SMS notification to a user
 * 
 * @param phoneNumber The user's phone number (with country code, e.g., +1234567890)
 * @param message The SMS message
 * @returns Promise<boolean> Success status
 */
export async function sendWaitlistSMS(phoneNumber: string, message: string): Promise<boolean> {
  try {
    return await sendSMS({
      to: phoneNumber,
      body: message
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
    return false;
  }
}

/**
 * Add user to SendGrid marketing list
 * 
 * @param user The user to add
 * @param listId The SendGrid list ID
 * @returns Promise<boolean> Success status
 */
export async function addUserToMarketingList(user: WaitlistUser, listId: string): Promise<boolean> {
  try {
    return await addToContactList(user.email, listId, {
      first_name: user.name.split(' ')[0],
      last_name: user.name.split(' ').slice(1).join(' '),
      state: user.state,
      selected_casinos: user.selectedCasinos.join(', '),
      referral_code: user.referralCode
    });
  } catch (error) {
    console.error('Error adding user to marketing list:', error);
    return false;
  }
}