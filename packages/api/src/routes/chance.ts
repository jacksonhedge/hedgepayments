import { Router, Request, Response } from 'express';
import * as walletStore from '../services/walletStore';
import * as fundingService from '../services/fundingService';
import { logger } from '../utils/logger';

export const chanceRouter = Router();

chanceRouter.post('/wallet', async (_req: Request, res: Response) => {
  try {
    const wallet = await walletStore.createWallet('USD');
    res.json({ walletId: wallet.id, currency: wallet.currency });
  } catch (e: any) {
    logger.error('create wallet failed', { e: e.message });
    res.status(500).json({ error: 'could not create wallet' });
  }
});

chanceRouter.get('/wallet/:id', async (req: Request, res: Response) => {
  const wallet = await walletStore.getWallet(req.params.id);
  if (!wallet) return res.status(404).json({ error: 'wallet not found' });
  res.json({
    walletId: wallet.id,
    currency: wallet.currency,
    balanceCents: wallet.balanceCents,
    balance: wallet.balanceCents / 100,
  });
});

chanceRouter.post('/funding/sessions', async (req: Request, res: Response) => {
  const { walletId, amount, currency } = req.body || {};
  if (!walletId) return res.status(400).json({ error: 'walletId required' });
  if (!(Number(amount) > 0)) return res.status(400).json({ error: 'amount must be positive' });
  try {
    const out = await fundingService.startFunding({ walletId, amount: Number(amount), currency });
    res.json(out);
  } catch (e: any) {
    logger.error('funding session failed', { e: e.message });
    res.status(500).json({ error: 'could not start checkout' });
  }
});
