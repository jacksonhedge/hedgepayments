export type Venue = 'polymarket' | 'kalshi';
export type ChanceMode = 'round_up' | 'flip-to-free' | 'win-it-back';

export interface Candidate {
  marketId: string;          // "slug|outcome"
  question: string;
  outcome: string;
  venue: Venue;
  price: number;             // 0 < price < 1
  resolves_at: string | null;
  liquidity: number;
  tags: string[];
}

export interface OfferDisplay {
  chancePct: number;
  odds: string;              // e.g. "12:1"
  framedDiscountPct: number; // capped at 100 (never "more than free")
  achievesFree: boolean;
  payToday: number;          // amount + stake (flip-to-free)
  winPayout: number;         // stake / price, rounded
}

export interface Offer {
  id: string;                // 's0'/'p0'... assigned at pool build
  kind: 'single' | 'parlay';
  legs: Candidate[];         // 1 leg for single, 2-3 for parlay
  price: number;             // single: leg price; parlay: product of leg prices
  display: OfferDisplay;
}

export interface PurchaseContext {
  amount: number;
  productTitle?: string;
  category?: string;
  mode: ChanceMode;
}

export interface RankedOffer { offerId: string; rank: number; reason?: string }

export interface RankInput { context: PurchaseContext; offers: Offer[]; max: number }

export interface RankProvider { rank(input: RankInput): Promise<RankedOffer[]> }
