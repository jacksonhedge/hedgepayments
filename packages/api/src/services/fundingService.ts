import Stripe from 'stripe';
import { stripe } from '../lib/stripe';
import { config } from '../config';
import * as walletStore from './walletStore';
import { logger } from '../utils/logger';

export async function startFunding(input: { walletId: string; amount: number; currency?: string; }) {
  const currency = (input.currency || 'USD').toUpperCase();
  const amountCents = Math.round(input.amount * 100);
  if (!(amountCents > 0)) throw new Error('amount must be positive');

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    client_reference_id: input.walletId,
    metadata: { walletId: input.walletId },
    success_url: config.chance.successUrl,
    cancel_url: config.chance.cancelUrl,
    line_items: [{
      quantity: 1,
      price_data: {
        currency: currency.toLowerCase(),
        unit_amount: amountCents,
        product_data: { name: 'Chance wallet funding' },
      },
    }],
  });

  await walletStore.createFundingSession({
    walletId: input.walletId, amountCents, currency, stripeSessionId: session.id,
  });
  return { checkoutUrl: session.url as string, sessionId: session.id };
}

export async function handleWebhookEvent(event: Stripe.Event): Promise<void> {
  if (event.type !== 'checkout.session.completed') return;
  const session = event.data.object as Stripe.Checkout.Session;
  const walletId = (session.metadata?.walletId) || (session.client_reference_id as string);
  if (!walletId) { logger.error('webhook missing walletId', { id: session.id }); return; }

  const amountCents = session.amount_total ?? 0;
  const currency = (session.currency || 'usd').toUpperCase();
  const result = await walletStore.creditWallet({
    walletId, amountCents, currency, externalId: session.id,
  });
  await walletStore.completeFundingSession(session.id);
  logger.info('chance funding credited', { walletId, amountCents, credited: result.credited });
}
