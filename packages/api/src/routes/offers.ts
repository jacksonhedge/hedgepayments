import { Router, Request, Response } from 'express';
import Joi from 'joi';
import { logger } from '../utils/logger';
import { getChanceSettings } from '../services/merchantSettings';
import { roundUpStake, pFree, frameOffer } from '../lib/offers/calc';
import { SyntheticComboSource } from '../lib/offers/comboSource';
import { getRankProvider, safeRank, mergeRanked } from '../lib/offers/rankProvider';
import { Candidate, Offer } from '../lib/offers/types';

export const offersRouter = Router();

const RANK_MS = 1500;
const MAX_OFFERS = 6;

const candidateSchema = Joi.object({
  marketId: Joi.string().max(200).required(),
  question: Joi.string().allow('').max(300).required(),
  outcome: Joi.string().allow('').max(120).required(),
  venue: Joi.string().valid('polymarket', 'kalshi').required(),
  price: Joi.number().greater(0).less(1).required(),
  resolves_at: Joi.string().allow(null),
  liquidity: Joi.number().min(0).required(),
  tags: Joi.array().items(Joi.string().max(60)).max(20).default([]),
}).unknown(true); // drop-in Candidate carries extras (winProbPct, seed); the LLM prompt only reads known fields

const bodySchema = Joi.object({
  merchantId: Joi.string().max(200).required(),
  context: Joi.object({
    amount: Joi.number().positive().max(1_000_000).required(),
    productTitle: Joi.string().allow('').max(300).optional(),
    category: Joi.string().allow('').max(120).optional(),
    mode: Joi.string().valid('round_up', 'flip-to-free', 'win-it-back').default('round_up'),
  }).required(),
  candidates: Joi.array().items(candidateSchema).max(50).default([]),
});

function buildSingles(cands: Candidate[], amount: number, stake: number): Offer[] {
  return cands.map((c, i) => ({
    id: 's' + i,
    kind: 'single' as const,
    legs: [c],
    price: c.price,
    display: frameOffer(amount, stake, c.price),
  }));
}

offersRouter.post('/rank', async (req: Request, res: Response) => {
  const { value, error } = bodySchema.validate(req.body || {});
  if (error) return res.status(400).json({ error: error.message });

  try {
    const { merchantId, context, candidates } = value;
    const amount: number = context.amount;
    const stake = roundUpStake(amount);
    const target = pFree(amount, stake);

    let settings;
    try {
      settings = await getChanceSettings(merchantId);
    } catch (e: any) {
      logger.error('chance settings load failed', { e: e?.message });
      settings = { aiProvider: 'off' as const, aiModel: null, parlaysEnabled: false };
    }

    const pool: Offer[] = buildSingles(candidates as Candidate[], amount, stake);
    if (settings.parlaysEnabled) {
      const combos = new SyntheticComboSource().build(candidates as Candidate[], {
        targetPrice: target, amount, stake, maxOffers: 4,
      });
      pool.push(...combos);
    }

    const provider = getRankProvider(settings.aiProvider, settings.aiModel || undefined);
    const ranked = await safeRank(provider, { context, offers: pool, max: MAX_OFFERS }, RANK_MS);
    const offers = mergeRanked(pool, ranked, MAX_OFFERS);

    res.json({ offers, ranked: ranked.length > 0, mode: context.mode, stake, demo: true });
  } catch (e: any) {
    logger.error('offers rank failed', { e: e?.message });
    res.status(500).json({ error: 'could not rank offers' });
  }
});
