import { Router, Request, Response } from 'express';
import * as linkStore from '../services/linkStore';
import { config } from '../config';
import { logger } from '../utils/logger';

export const linkRouter = Router();

linkRouter.post('/sessions', async (req: Request, res: Response) => {
  if (!config.hedge.linkKey || req.header('x-hedge-key') !== config.hedge.linkKey) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  const { product, config: cfg, env } = req.body || {};
  if (!product) return res.status(400).json({ error: 'product required' });
  try {
    const s = await linkStore.createSession({ product, config: cfg, env });
    res.json({ link_token: s.token, expires_at: s.expiresAt });
  } catch (e: any) { logger.error('link session create failed', { e: e.message }); res.status(500).json({ error: 'could not create session' }); }
});

linkRouter.post('/sessions/:token/exchange', async (req: Request, res: Response) => {
  const result = await linkStore.exchange(req.params.token);
  if (!result) return res.status(410).json({ error: 'INVALID_LINK_TOKEN', error_code: 'INVALID_LINK_TOKEN' });
  res.json(result);
});

linkRouter.post('/sessions/:token/consume', async (req: Request, res: Response) => {
  const { token } = req.params;
  const { result } = req.body || {};
  const consumed = await linkStore.consumeOnSuccess(token, result ?? null);
  if (!consumed) {
    const status = await linkStore.selectStatus(token);
    if (status === 'consumed') {
      return res.status(409).json({ error: 'already_consumed', error_code: 'ALREADY_CONSUMED' });
    }
    return res.status(410).json({ error: 'INVALID_LINK_TOKEN', error_code: 'INVALID_LINK_TOKEN' });
  }
  res.json({ ok: true });
});
