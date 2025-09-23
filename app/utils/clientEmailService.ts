// Client-safe email service functions that call API routes

export async function getWaitlistCount(): Promise<number> {
  try {
    const response = await fetch('/api/waitlist/count');
    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error('Error getting waitlist count:', error);
    return 0;
  }
}

export async function subscribeToWaitlist(email: string, referralCode?: string, sportsbooks?: string[]): Promise<{ success: boolean; referralCode?: string }> {
  try {
    const response = await fetch('/api/waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        referralCode,
        sportsbooks: sportsbooks || []
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error subscribing to waitlist:', error);
    return { success: false };
  }
}

export async function notifyWaitlistUsers(subject: string, message: string): Promise<boolean> {
  try {
    const response = await fetch('/api/waitlist/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subject, message }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error notifying waitlist users:', error);
    return false;
  }
}