import { OpenAIRankProvider } from '../providers/openai';
import { Offer } from '../types';

const offer = (id: string): Offer => ({
  id, kind: 'single', legs: [{ marketId: id + '|Yes', question: 'Q ' + id, outcome: 'Yes', venue: 'polymarket', price: 0.25, resolves_at: null, liquidity: 5000, tags: ['nba'] }],
  price: 0.25, display: { chancePct: 25, odds: '3.0:1', framedDiscountPct: 8, achievesFree: false, payToday: 51, winPayout: 4 },
});

describe('OpenAIRankProvider', () => {
  it('parses the JSON content into a ranking', async () => {
    const fakeClient = {
      chat: { completions: { create: async () => ({ choices: [{ message: { content: JSON.stringify({ ranked: [{ offerId: 's0', rank: 0 }] }) } }] }) } },
    };
    const provider = new OpenAIRankProvider('gpt-4o-mini', fakeClient as any);
    const out = await provider.rank({ context: { amount: 50, mode: 'round_up' }, offers: [offer('s0')], max: 6 });
    expect(out).toEqual([{ offerId: 's0', rank: 0 }]);
  });

  it('returns [] on unparseable content', async () => {
    const fakeClient = { chat: { completions: { create: async () => ({ choices: [{ message: { content: 'not json' } }] }) } } };
    const provider = new OpenAIRankProvider('gpt-4o-mini', fakeClient as any);
    const out = await provider.rank({ context: { amount: 50, mode: 'round_up' }, offers: [offer('s0')], max: 6 });
    expect(out).toEqual([]);
  });
});
