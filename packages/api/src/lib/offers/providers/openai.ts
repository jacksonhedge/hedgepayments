import OpenAI from 'openai';
import { RankProvider, RankInput, RankedOffer, Offer, PurchaseContext } from '../types';

const SYSTEM =
  'You curate prediction-market offers for a shopper at checkout. Rank the given offers for ' +
  'relevance to what they are buying and appeal/likelihood to play. Use only offerIds from the list — ' +
  'never invent an id. Respond as JSON {"ranked":[{"offerId","rank","reason"}]}; rank 0 is shown first.';

function userPrompt(context: PurchaseContext, offers: Offer[], max: number): string {
  const slim = offers.map(o => ({
    id: o.id, kind: o.kind, odds: o.display.odds, framedDiscountPct: o.display.framedDiscountPct,
    achievesFree: o.display.achievesFree, questions: o.legs.map(l => l.question), tags: o.legs.flatMap(l => l.tags),
  }));
  return [
    `Purchase: ${context.productTitle ?? 'unknown item'} (category: ${context.category ?? 'unknown'}), amount $${context.amount}.`,
    `Return up to ${max} offers, best first.`,
    `Offers: ${JSON.stringify(slim)}`,
  ].join('\n');
}

export class OpenAIRankProvider implements RankProvider {
  private client: OpenAI;
  constructor(private model: string = 'gpt-4o-mini', client?: OpenAI) {
    this.client = client ?? new OpenAI();
  }

  async rank({ context, offers, max }: RankInput): Promise<RankedOffer[]> {
    const res: any = await this.client.chat.completions.create({
      model: this.model,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: userPrompt(context, offers, max) },
      ],
    } as any);
    try {
      const parsed = JSON.parse(res.choices?.[0]?.message?.content ?? '{}');
      return Array.isArray(parsed.ranked) ? (parsed.ranked as RankedOffer[]) : [];
    } catch {
      return [];
    }
  }
}
