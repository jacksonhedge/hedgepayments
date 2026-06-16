import { AnthropicRankProvider } from '../providers/anthropic';
import { Offer } from '../types';

const offer = (id: string): Offer => ({
  id, kind: 'single', legs: [{ marketId: id + '|Yes', question: 'Q ' + id, outcome: 'Yes', venue: 'polymarket', price: 0.25, resolves_at: null, liquidity: 5000, tags: ['nba'] }],
  price: 0.25, display: { chancePct: 25, odds: '3.0:1', framedDiscountPct: 8, achievesFree: false, payToday: 51, winPayout: 4 },
});

describe('AnthropicRankProvider', () => {
  it('returns the parsed ranking and sends offer ids + context to the model', async () => {
    const calls: any[] = [];
    const fakeClient = {
      messages: {
        parse: async (req: any) => {
          calls.push(req);
          return { parsed_output: { ranked: [{ offerId: 's1', rank: 0 }, { offerId: 's0', rank: 1 }] } };
        },
      },
    };
    const provider = new AnthropicRankProvider('claude-haiku-4-5', fakeClient as any);
    const out = await provider.rank({
      context: { amount: 50, mode: 'round_up', productTitle: 'Running shoes', category: 'footwear' },
      offers: [offer('s0'), offer('s1')], max: 6,
    });

    expect(out).toEqual([{ offerId: 's1', rank: 0 }, { offerId: 's0', rank: 1 }]);
    expect(calls[0].model).toBe('claude-haiku-4-5');
    const prompt = JSON.stringify(calls[0].messages);
    expect(prompt).toContain('s0');
    expect(prompt).toContain('s1');
    expect(prompt).toContain('Running shoes');
  });

  it('returns [] when the model yields no parsed output', async () => {
    const fakeClient = { messages: { parse: async () => ({ parsed_output: null }) } };
    const provider = new AnthropicRankProvider('claude-haiku-4-5', fakeClient as any);
    const out = await provider.rank({ context: { amount: 50, mode: 'round_up' }, offers: [offer('s0')], max: 6 });
    expect(out).toEqual([]);
  });
});
