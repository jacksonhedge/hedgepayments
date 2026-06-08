// Fire-and-forget Slack notification via an Incoming Webhook.
// No-op when SLACK_WEBHOOK_URL is unset; never throws — a failed ping must not
// break the request it's attached to.
export async function notifySlack(text: string): Promise<void> {
  const url = process.env.SLACK_WEBHOOK_URL
  if (!url) return
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text }),
    })
  } catch (e) {
    console.error('Slack notify failed:', e)
  }
}
