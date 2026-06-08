import { Request, Response } from 'express';
import { stripe } from '../lib/stripe';
import { config } from '../config';
import * as fundingService from '../services/fundingService';
import { logger } from '../utils/logger';

// Mount with express.raw({ type: 'application/json' }) so req.body is the raw Buffer.
export async function chanceWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'] as string;
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, config.stripe.webhookSecret);
  } catch (e: any) {
    logger.error('webhook signature failed', { e: e.message });
    return res.status(400).json({ error: 'invalid signature' });
  }
  try {
    await fundingService.handleWebhookEvent(event);
  } catch (e: any) {
    logger.error('webhook handler error', { e: e.message });
    return res.status(500).json({ error: 'handler error' });
  }
  res.json({ received: true });
}
