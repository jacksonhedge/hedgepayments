import { OfferDisplay } from './types';

export const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;
export const clamp = (n: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, n));

export function oddsLabel(p: number): string {
  if (p <= 0 || p >= 1) return '—';
  const x = (1 - p) / p;
  return (x >= 10 ? Math.round(x) : x.toFixed(1)) + ':1';
}

/** Stake = round-up change to the next whole dollar; a whole amount stakes a full $1. */
export function roundUpStake(amount: number): number {
  const stake = Math.ceil(amount) - amount;
  return stake < 0.005 ? 1 : round2(stake);
}

/** Combined price at which a win on `stake` exactly covers `amount` (free order). */
export function pFree(amount: number, stake: number): number {
  return stake / amount;
}

/** Honest display framing for an offer priced at `price`, staking the round-up `stake`. */
export function frameOffer(amount: number, stake: number, price: number): OfferDisplay {
  const p = clamp(price, 0.0001, 0.9999);
  const winPayout = round2(stake / p);
  const coverage = Math.min(winPayout, amount);          // cap at free
  return {
    chancePct: p < 0.1 ? Math.round(p * 1000) / 10 : Math.round(p * 100),
    odds: oddsLabel(p),
    framedDiscountPct: Math.round((coverage / amount) * 100),
    achievesFree: winPayout >= amount - 1e-9,
    payToday: round2(amount + stake),
    winPayout,
  };
}
