import { Router, Request, Response } from 'express';
import * as marketing from '../services/marketingService';
import { logger } from '../utils/logger';

export const marketingRouter = Router();
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

marketingRouter.post('/waitlist', async (req: Request, res: Response) => {
  const email = String((req.body && req.body.email) || '').toLowerCase().trim();
  const source = req.body && req.body.source;
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'valid email required' });
  try {
    await marketing.joinWaitlist(email, source);
    res.json({ ok: true });
  } catch (e: any) { logger.error('waitlist join failed', { e: e.message }); res.status(500).json({ error: 'could not join waitlist' }); }
});

marketingRouter.post('/subscribe', async (req: Request, res: Response) => {
  const email = String((req.body && req.body.email) || '').toLowerCase().trim();
  const name = String((req.body && req.body.name) || '').trim();
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'valid email required' });
  if (!name) return res.status(400).json({ error: 'name required' });
  try {
    await marketing.subscribe(email, name);
    res.json({ ok: true });
  } catch (e: any) { logger.error('subscribe failed', { e: e.message }); res.status(500).json({ error: 'could not subscribe' }); }
});
